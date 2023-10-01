import { types } from "../types/types";

const initialState = {
    counter: 0,
    formValues: {
      idUsuario: 0,
      idEvento: 0,
      idSector: 0,
      idMedioPago: 0,
      montoPago: 0,
      montoTotal: 0,
      fechaTicket: '',
      activo: true,
    },
  };

export const ticketReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.updateFormValues:
            return { ...state, formValues: {...state.formValues, ...action.payload } };
        case types.updateIdUsuarioValue:
            return {
                ...state,
                formValues: {
                    ...state.formValues,
                    idUsuario: action.payload 
                }
            };
        case types.updateIdMedioPagoValue:
            return {
                ...state,
                formValues: {
                    ...state.formValues,
                    idMedioPago: action.payload 
                }
            };
        case types.updateIdEventoValue:
            return {
                ...state,
                formValues: {
                    ...state.formValues,
                    idEvento: action.payload 
                }
            };
        case types.updateIdSectorValue:
            return {
                ...state,
                formValues: {
                    ...state.formValues,
                    idSector: action.payload 
                }
            };
        case types.updateMontoPagoValue:
            return {
                ...state,
                formValues: {
                    ...state.formValues,
                    montoPago: action.payload 
                }
            };

        case types.resetFormValues: 
            return {
                ...state,
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
            };
        default:
            return state;
    }
}