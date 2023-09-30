import {Suspense, lazy} from 'react';
import { Route, Routes} from 'react-router-dom';
import { AutorScreen } from '../components/autor/AutorScreen';
import { DashboardScreen } from '../components/dashboard/DashboardScreen';
import { PerfilScreen } from '../components/perfil/PerfilScreen';
import { ProcesoCarga } from '../components/procesoCarga/ProcesoCarga';
import { Loader } from '../components/ui/loader/Loader';
// import { GeneracionTicket } from '../components/ticket/GeneracionTicket';
import { GeneracionTicket } from '../components/ticket/GeneracionTicket2';
import { TicketControlPanel } from '../components/ticket/TicketControlPanel';
import { ValidacionTicket } from '../components/validacionTickets/ValidacionTickets';
const LazyNavSidebar = lazy(() => import('../components/ui/nav/NavSidebar'));
const LazyMenuScreen = lazy(() => import('../components/menu/MenuScreen'));

export const DashboardRoutes = () => {
  return (
    <>
        <Suspense fallback={<Loader />}>
          <LazyNavSidebar />
        </Suspense> 

        <div className='container'>
          <Routes>
            <Route path='dashboard' element={ <DashboardScreen /> } />
            <Route path='menu' element={ <Suspense fallback={<Loader />}> 
                                            <LazyMenuScreen />
                                          </Suspense> } />
            <Route path='autor' element={ <AutorScreen /> } />
            <Route path='perfil' element={ <PerfilScreen /> } />
            <Route path='procesoCarga' element={ <ProcesoCarga /> } />

            <Route path='generarTicket' element={ <GeneracionTicket /> } />
            <Route path='ticketControlPanel' element={ <TicketControlPanel />} />
            <Route path='validacionTickets' element={ <ValidacionTicket /> } />
            <Route path='/' element={ <DashboardScreen />} />
          </Routes>
        </div>
    </>
  )
}
