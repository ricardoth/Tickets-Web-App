export const environment = {
    ID_APP: 1,
    //Tipo Autenticación
    BasicAuthType: "Basic",
    JWTAuthType: "Bearer",

    //Basic Auth ApiDecimatio
    UserBasicAuth: 'UsrApiDecimatio',
    PasswordBasicAuth: 'a13997423b6df6a7131981d215f1d3bb',

    //Login
    UrlApiToken: "http://localhost:8086/api/Token",

    //IdentificationServerAPI
    UrlApiMenu: "http://localhost:8086/api/Menu",
    urlApiMenuUsuario: "http://localhost:8086/api/GetMenuUsuario",
    urlApiInfoUsuario: "http://localhost:8086/api/GetInfoUsuario/",
    UrlApiMenuPadre: "http://localhost:8086/api/GetMenuPadre",

    //BibliotecaAPI
    UrlApiAutores: "https://localhost:7190/api/Autor",

    //Tickets Eventos
    UrlGeneracionTicket: "https://localhost:7100/api/Ticket",
    UrlGetUsuarios: "https://localhost:7100/api/Usuario",
    UrlGetEventos: "https://localhost:7100/api/Evento",
    UrlGetSectores: "https://localhost:7100/api/Sector",
    UrlGetMedioPagos: "https://localhost:7100/api/MedioPago",
};