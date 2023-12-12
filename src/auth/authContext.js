import { createContext, useReducer } from 'react';
import { authReducer } from './authReducer';

export const AuthContext = createContext();

const initialState = {
    logged: false,
    user: null
}

const init = () => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (error) {
            console.error('Error parsing stored auth data', error);
        }
    }
    return initialState;
};

export const AuthProvider = ({children}) => {
    const [user, dispatch ] = useReducer(authReducer, initialState, init);

    return (
        <AuthContext.Provider value={{user, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}