# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Create React App (react-scripts 5) frontend for managing and generating event tickets ("Tickets-Web-App" / `bibliotecta-web`). React 18, React-Bootstrap, Formik + Yup, React-Data-Table-Component, React-Router-Dom v6, React-Select, SweetAlert2. Spanish is the language used throughout the UI, variable names, and component names (e.g. `Lugar` = place/venue, `Evento` = event, `Sector`, `MedioPago` = payment method, `Usuario` = user).

## Commands

```bash
npm start          # dev server (CRA)
npm run build       # production build (CI=false, so build warnings don't fail the build)
npm test             # react-scripts test / Jest+RTL, interactive watch mode
npm test -- --watchAll=false --testPathPattern=<name>   # run a single test file non-interactively
```

There are currently no test files in `src/` despite the CRA/RTL scaffolding (`setupTests.js`, `@testing-library/*` deps) being present.

Docker:
```bash
docker build -t web-tickets-app .
docker compose -f docker-compose.dev.yml up
docker compose -f docker-compose.prod.yml up
```
Deploys to Azure Static Web Apps via `.github/workflows/azure-static-web-apps-*.yml`; also has `netlify.toml` for Netlify deploys.

## Architecture

### Environment config is NOT switched by build mode

`src/environment/environment.dev.js` and `environment.prod.js` both exist, but **every file in the app imports `environment.dev.js` directly** (hardcoded relative path), regardless of `NODE_ENV`. `environment.prod.js` is not imported anywhere and is effectively dead. This means:
- To point the app at different API URLs (e.g. before a prod deploy), the actual URLs inside `environment.dev.js` must be edited directly, or every import site changed.
- Don't assume changing `environment.prod.js` has any effect — it doesn't, until something actually imports it.
- `environment.dev.js` currently holds the real Azure-hosted API endpoints (`api-decimatio-dev.azurewebsites.net`, `api-identification-sso.azurewebsites.net`) used for both local dev and deployed builds; local-only URLs are present but commented out.

### Auth: two separate schemes coexist

- **Basic Auth** (`environment.BasicAuthType`, hardcoded credentials in `environment.js` re-exported via `src/types/basicAuth.js`) is used for most CRUD screens (Lugar, Sector, Evento, MedioPago, Usuario, etc). Requests build the header manually: `Authorization: Basic ${Buffer.from(user:pass).toString('base64')}`.
- **JWT/Bearer** (`environment.JWTAuthType`, token from `AuthContext`'s `user.token`) is used post-login for user-specific calls.
- `src/components/ui/combobox/Combobox.js` is a generic reusable `<select>` populated from an API URL; it takes a `tipoAuth` prop (`environment.BasicAuthType` or `JWTAuthType`) to pick which header scheme to use, and a `parser` function (see `src/types/parsers.js`) to map API rows into `{label, value}` options. It also auto-filters rows by an `activo`/`esActivo` boolean field if present.
- `src/interceptors/axiosInterceptor.js` installs global axios request/response interceptors but currently does no real error handling (logout-on-401 logic is commented out); actual session-expiry handling is done ad hoc inside individual components' `.catch()` blocks (see below).

### Global state: two independent Context+useReducer stores

- `AuthContext` (`src/auth/`) — holds `{ user, dispatch }`, `logged` flag, initialized from `localStorage.getItem('user')`. Actions defined in `src/types/types.js` (`types.login`, `types.logout`).
- `TicketContext` (`src/context/`) — holds ticket-generation wizard state (`formValues`, `activeTab`, `base64Pdf`, `isLoading`, etc) used across the multi-step ticket generation flow (`src/components/ticket/`).
- Both providers wrap the app in `src/BibliotecaApp.js`. Note `BibliotecaApp`'s `init()` calls `localStorage.clear()` unconditionally before reading `user` back out — effectively a no-op reset on every load.
- Routing-level auth guard is `PrivateRoute`/`PublicRoute` (`src/routers/`), which read `user.logged` from `AuthContext` and redirect to/from `/login`. `PrivateRoute` also persists `lastPath` to `localStorage` on every render.

### Screen/feature module pattern

Each domain entity under `src/components/<entity>/` (e.g. `lugar`, `sector`, `evento`, `medioPago`, `usuario`, `menu`) follows the same CRUD shape:
- `<Entity>Screen.js` — page shell, holds "show add modal" state, renders Table + AddModal.
- `<Entity>Table.js` — fetches the list via axios + Basic Auth header, renders a `DataTable` (react-data-table-component) with inline Edit/Delete action buttons (delete is typically a soft "desactivar" via SweetAlert2 confirm), triggers `<Entity>EditModal` on edit.
- `<Entity>AddModal.js` / `<Entity>EditModal.js` — `react-bootstrap` `Modal` wrapping a Formik form with Yup `validationSchema`, submits via axios POST/PUT, wrapped in a SweetAlert2 confirm dialog before the API call and a result alert after.
- Re-fetch after mutation is done by toggling a state value that's passed as a `useEffect` dependency into the Table (e.g. `changeAddForm`, `showEditLugar`), not through the shared context.

When adding a new CRUD entity screen, follow this existing four-file pattern (Screen/Table/AddModal/EditModal) rather than introducing a new structure.

### Routing

`AppRouter.js` (top-level `BrowserRouter`) separates `PublicRoute` paths (`/login`, `/resetPassword`, `/changePassword`) from a catch-all `/*` `PrivateRoute` that renders `DashboardRoutes.js`. `DashboardRoutes.js` lazy-loads `NavSidebar` and `MenuScreen` (`React.lazy` + `Suspense`) and defines all authenticated feature routes (dashboard, ticket generation/control/validation, evento/sector/usuario/lugar/medioPago CRUD, MercadoPago tickets).

### Ticket generation flow

`src/components/ticket/` implements a multi-step wizard (`GeneracionTicket.js` as orchestrator, `CardInfoCliente`/`CardInfoEvento`/`CardInfoMedioPago` as steps, `ModalTicketControlPanel`, `FilterControlPanel`, `TicketControlPanel`) driven by `TicketContext`'s `formValues`/`activeTab` state rather than local component state, since data must persist across steps.
