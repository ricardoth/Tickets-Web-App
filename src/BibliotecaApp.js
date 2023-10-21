import React, { useEffect, useReducer } from 'react';
import { AuthContext, AuthProvider } from './auth/authContext'; 
import { authReducer } from './auth/authReducer';
import { AppRouter } from './routers/AppRouter';
import { AxiosInterceptor } from './interceptors/axiosInterceptor';
import { TicketProvider } from './context/ticketContext';

const init = () => {
  // localStorage.setItem('user', JSON.stringify(user));
  // console.log(localStorage.getItem('user'));
  // return JSON.parse(localStorage.getItem('user')) || { logged: false };
  return { logged: false };
}

AxiosInterceptor();

export const BibliotecaApp = () => {
  const [user, dispatch] = useReducer(authReducer, {}, init);

  useEffect(() => {
    if (!user) return;
    
    localStorage.setItem('user', JSON.stringify(user));
  }, [user])
  

  return (
    <div>
        <AuthProvider>
            <TicketProvider>  
                <AppRouter />
            </TicketProvider> 
        </AuthProvider> 
    </div>
  )
}
