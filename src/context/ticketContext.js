import { createContext, useReducer } from "react";
import { ticketReducer } from "./ticketReducer";

export const TicketContext = createContext();

export const TicketProvider = ({children}) => {
    const initialState = {
        base64Pdf: '',
        isOpen: false,
        isLoading: false,
        continuar: true,
        activeTab: 'cliente',
        formValues: {
            idUsuario: 0,
            idEvento: 0,
            idSector: 0,
            idMedioPago: 0,
            montoPago: 0,
            montoTotal: 0,
            fechaTicket: '',
            activo: true,
        }
    }

    const [ticketState, ticketDispatch] = useReducer(ticketReducer, initialState);

    return (
        <TicketContext.Provider value={{ticketState, ticketDispatch}}>
            {children}
        </TicketContext.Provider>
    );
}