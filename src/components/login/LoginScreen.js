import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { useForm } from '../../hooks/useForm';
import { types} from '../../types/types';
import { environment } from '../../environment/environment.dev';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Loader } from '../ui/loader/Loader';
import './Form.css'
import { FaLock, FaTicketAlt, FaUser } from 'react-icons/fa';

const urlLogin = environment.UrlApiToken;
const urlInfoUser = environment.urlApiInfoUsuario;

export const LoginScreen = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [formValues, handleInputChange] = useForm({
      usuario: '',
      password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      if (formValues.usuario !== "" && formValues.password !== "") {
        const userLogin = {
          User: formValues.usuario,
          Password: formValues.password
        }
        setLoading(true);
         await fetch(urlLogin, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userLogin)
         })
         .then(response => {
          if(response.ok) {
            return response.json();
          } 
         })
         .then(data => {
            setLoading(false);
           if (data != null) {
            handleInfoUser(userLogin.User, data.token);
           } else {
            Swal.fire('Usuario y/o contraseña inválidas', '', 'error');
           }
         })
         .catch((err) => console.log(err));
      } else {
        Swal.fire('Debe completar los campos para realizar el inicio de sesión', '', 'error');
      }
    }

    const handleInfoUser = async (userLogin, token) => {
      try {
        setLoading(true);
        const response = await axios.get(urlInfoUser + userLogin, {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
        });
          const { rut } = response.data.data;
          const basicInfoUser = {
            type: types.login,
            payload: { user: userLogin, rut: rut, token: token} 
          }
          dispatch(basicInfoUser);

          const lastPath = localStorage.getItem('lastPath') || '/dashboard';
          navigate(lastPath, {
            replace: true
          });

          setLoading(false);
      } catch (error) {
        console.error('API error:', error);
        setLoading(false);
      }
    }

    return (
      <div className=''>
      <section id='section'>
        <div className="login-box">
            <form action="">
                <h2>Ticketera <FaTicketAlt /></h2>
                <div className="input-box">
                    <span className="icon">
                        <FaUser />
                    </span>
                    <input 
                      type="text" 
                      name='usuario' 
                      placeholder='Usuario' 
                      autoComplete="off" 
                      onChange={handleInputChange} 
                      value={formValues.usuario}
                      required
                    />
                </div>
                <div className="input-box">
                    <span className="icon">
                      <FaLock />
                    </span>
                    <input 
                      type="password"
                      name='password' 
                      autoComplete="off" 
                      onChange={handleInputChange} 
                      value={formValues.password}
                      required
                    />
                    <label>Contraseña</label>
                </div>
                <div className="remember-forgot">
                    {/* <label>
                        <input type="checkbox" />
                        Recuerdame
                    </label>  */}
                    <Link to={'/resetPassword'}>¿Olvidaste tu Contraseña?</Link>
                </div>

                { loading ? <Loader /> : 
                  <button className='button-login' onClick={handleLogin}>
                      Login
                  </button>}
            </form>
                
        </div>
        </section>
      </div>
    )
}