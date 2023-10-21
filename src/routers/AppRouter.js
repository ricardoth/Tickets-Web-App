import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { LoginScreen } from '../components/login/LoginScreen';
import { DashboardRoutes } from './DashboardRoutes';
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { RequestChangePassword } from '../components/login/RequestChangePassword';
import { ChangePassword } from '../components/login/ChangePassword';

export const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            }/>

            <Route path='/resetPassword' element={
              <PublicRoute>
                <RequestChangePassword />
              </PublicRoute>
            }/>

            <Route path='/changePassword' element={
              <PublicRoute>
                <ChangePassword />
              </PublicRoute>
            }/>

            <Route path='/*' element={
              <PrivateRoute>
                <DashboardRoutes />
              </PrivateRoute>
            }/>
        </Routes>
    </BrowserRouter>
  )
}
