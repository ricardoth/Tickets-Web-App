import { useFormik } from 'formik';
import { MdPassword } from 'react-icons/md';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { environment } from '../../environment/environment.dev';

import './Form.css';
import * as Yup from 'yup';
import axios from 'axios';
import { Loader } from '../ui/loader/Loader';
import Swal from 'sweetalert2';

const UrlResetPassword = environment.UrlResetPassword;

const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required('La Contraseña es requerida'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben ser iguales').required('La Confirmación de Contraseña es requerida')
});


const init = {
    correo: localStorage.getItem('correo') || null
}


export const ChangePassword = () => {
    const [ dialogConfirmPassword, setDialogConfirmPassword ] = useState(false);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let objValues = {
                correo: init.correo,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            }
            setLoading(true);
            
            await axios.post(UrlResetPassword, objValues)
            .then(res => {
                console.log(res)
                setDialogConfirmPassword(true);
                setLoading(false);
            })
            .catch(err => {
                const {response} = err;
                const mensajesArray = response.data.map(x => x.errorMessage);
                Swal.fire('Ha ocurrido un error al cambiar la contraseña', mensajesArray.toString(), 'error');
                setLoading(false);
            });

        }
    });

    return (    
        <div>
            <section id='section'>
                <div className="login-box">
                    <form onSubmit={formik.handleSubmit}>
                    <h4>Restablece tu Contraseña</h4>
                    {
                        !dialogConfirmPassword && 
                        <div>

                            <div className="input-box">
                                <span className="icon">
                                    <MdPassword />
                                </span>
                                <input 
                                    type="password" 
                                    name='newPassword' 
                                    placeholder='Contraseña Nueva' 
                                    autoComplete="off" 
                                    onChange={formik.handleChange} 
                                    value={formik.values.newPassword}
                                    required
                                />
                            </div>
                                {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <p style={{color:'white'}}>{formik.errors.newPassword}</p>
                                        ) : null}

                            <div className="input-box">
                                <span className="icon">
                                    <MdPassword />
                                </span>
                                <input 
                                    type="password" 
                                    name='confirmPassword' 
                                    placeholder='Repita su contraseña' 
                                    autoComplete="off" 
                                    onChange={formik.handleChange} 
                                    value={formik.values.confirmPassword}
                                    required
                                />
                            </div>
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <p style={{color:'white'}}>{formik.errors.confirmPassword}</p>
                                        ) : null}


                                {
                                    loading ? <Loader/> : <button type='submit' className='button-login'>
                                        Restablecer Contraseña
                                    </button>
                                }
                            
                        </div>
                    }
                        

                    { dialogConfirmPassword && ( 
                        <div className="input-box">
                            <p>Tu Contraseña se ha cambiado exitosamente.</p>
                            <button type='button' className='button-login'><Link to={'/login'}>Login</Link></button>
                        </div>
                    )} 
                    </form>
                </div>
            </section>
        </div>
    )
}
