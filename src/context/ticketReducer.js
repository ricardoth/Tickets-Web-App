import { types } from "../types/types";

const initialState = {
    base64Pdf: "",
    isOpen: false,
    isLoading: false,
    continuar: true,
    activeTab: 'cliente',
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
        case types.setBase64Pdf:
            return {...state, base64Pdf: action.payload };
        case types.toggleModal:
            return { ...state, isOpen: !state.isOpen };
        case types.setLoading:
            return { ...state, isLoading: action.payload };
        // case types.updateFormValues:
        //     return { ...state, formValues: {...state.formValues, ...action.payload } };
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
        default:
            return state;
    }
}