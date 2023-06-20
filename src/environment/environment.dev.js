export const environment = {
    ID_APP: 1,
    //Tipo Autenticación
    BasicAuthType: "Basic",
    JWTAuthType: "Bearer",

    //Basic Auth ApiDecimatio
    UserBasicAuth: 'UsrApiDecimatio',
    PasswordBasicAuth: 'a13997423b6df6a7131981d215f1d3bb',

    //Login
    UrlApiToken: "https://localhost:44383/api/Token",

    //IdentificationServerAPI
    UrlApiMenu: "https://localhost:44383/api/Menu",
    urlApiMenuUsuario: "https://localhost:44383/api/GetMenuUsuario",
    urlApiInfoUsuario: "https://localhost:44383/api/GetInfoUsuario/",
    UrlApiMenuPadre: "https://localhost:44383/api/GetMenuPadre",

    //BibliotecaAPI
    UrlApiAutores: "https://localhost:7190/api/Autor",

    //Tickets Eventos
    UrlGeneracionTicket: "https://localhost:7100/api/Ticket",
    UrlGetUsuarios: "https://localhost:7100/api/Usuario",
    UrlGetEventos: "https://localhost:7100/api/Evento",
    UrlGetSectores: "https://localhost:7100/api/Sector",
    UrlGetMedioPagos: "https://localhost:7100/api/MedioPago",

};

// export const environment = {
//     ID_APP: 1,

//     //Login
//     UrlApiToken: "http://localhost:9095/api/Token",

//     //IdentificationServerAPI
//     UrlApiMenu: "http://localhost:9095/api/Menu",
//     urlApiMenuUsuario: "http://localhost:9095/api/GetMenuUsuario",
//     urlApiInfoUsuario: "http://localhost:9095/api/GetInfoUsuario/",
//     UrlApiMenuPadre: "http://localhost:9095/api/GetMenuPadre",

//     //BibliotecaAPI
//     UrlApiAutores: "https://localhost:7190/api/Autor"
// };