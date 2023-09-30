import { createContext, useReducer } from 'react';
import { authReducer } from './authReducer';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const initialState = {
        logged: false,
        user: null
    }

    const [user, dispatch ] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{user, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}