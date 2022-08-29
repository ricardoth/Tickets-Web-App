import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { useForm } from '../../hooks/useForm';
import { types } from '../../types/types';
import { environment } from '../../environment/environment.dev';
import './LoginScreen.css'
import Swal from 'sweetalert2';

const urlLogin = environment.UrlApiToken;

export const LoginScreen = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useContext(AuthContext);
    const [formValues, handleInputChange, reset] = useForm({
      usuario: '',
      password: ''
    });

    const handleLogin = (e) => {
      e.preventDefault();
      // const action = {
      //   type: types.login,
      //   payload: { name: 'Ricardo Tilleria', rut: '17520926' }
      // }

      if (formValues.usuario !== "" && formValues.password !== "") {
        const userLogin = {
          User: formValues.usuario,
          Password: formValues.password
        }

         fetch(urlLogin, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userLogin)
         })
         .then(response => response.json())
         .then(data => {
            const action = {
              type: types.login,
              payload: { user: userLogin.User, password: userLogin.Password, rut: '17520926', token: data.token }
            }
            dispatch(action);

            const lastPath = localStorage.getItem('lastPath') || '/dashboard';

            navigate(lastPath, {
              replace: true
            })
         })
         .catch((err) => console.log(err))
        
      } else {
        Swal.fire('Debe completar los campos para realizar el inicio de sesión', '', 'error');

      }

    }

    return (
      <div className='container mt-5'>
        <div className='form-login'>
          <h1>Login</h1>
            <form className='form-group'>
              <div className='row'>
                <div className="col-lg-12">
                  <label>Nombre de Invocador</label>
                  <input 
                    type="text" 
                    name='usuario' 
                    className='form-control' 
                    placeholder='Nombre de Invocador' 
                    autoComplete="off" 
                    onChange={handleInputChange} 
                    value={formValues.usuario}
                  />
                </div>
              </div>
            
              <div className='row'>
                <div className="col-lg-12">
                  <label>Contraseña</label>
                  <input 
                    type="password"
                    name='password' 
                    className='form-control' 
                    placeholder='Contraseña' 
                    autoComplete="off" 
                    onChange={handleInputChange} 
                    value={formValues.password}
                  />
                </div>
              </div>
              <br />
              <button className='btn btn-primary col-lg-12' onClick={handleLogin}>
                  Iniciar
              </button>
            </form>
        </div>
      </div>
    )
}
