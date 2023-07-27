import React, { useEffect, useReducer } from 'react';
import { AuthContext } from './auth/authContext'; 
import { authReducer } from './auth/authReducer';
import { AppRouter } from './routers/AppRouter';
import { AxiosInterceptor } from './interceptors/axiosInterceptor';

const init = () => {
  // localStorage.setItem('user', JSON.stringify(user));
  // console.log(localStorage.getItem('user'));
  //return JSON.parse(localStorage.getItem('user')) || { logged: false };
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
        <AuthContext.Provider value={{
          user,
          dispatch
        }}>
          <AppRouter />
        </AuthContext.Provider>
    </div>
  )
}
