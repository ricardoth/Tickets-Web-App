import { useFormik } from 'formik';
import './Form.css';
import { MdPassword } from 'react-icons/md';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const init = {
    correo: localStorage.getItem('correo') || null
}

export const ChangePassword = () => {
    const [ dialogConfirmPassword, setDialogConfirmPassword ] = useState(false);

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: '',
        onSubmit: async (values) => {
            let objValues = {
                correo: init.correo,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            }
            setDialogConfirmPassword(true);
            console.log(objValues)

        }
    });

    return (
        <div>
            <section id='section'>
                <div className="login-box">
                    <form onSubmit={formik.handleSubmit}>
                    <h4>Restablece tu Contraseña</h4>
                        <div className="input-box">
                            <span className="icon">
                                <MdPassword />
                            </span>
                            <input 
                                type="password" 
                                name='oldPassword' 
                                placeholder='Contraseña Actual' 
                                autoComplete="off" 
                                onChange={formik.handleChange} 
                                value={formik.values.oldPassword}
                                required
                            />
                        </div>

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

                        <button type='submit' className='button-login'>
                            Restablecer Contraseña
                        </button>


                        { dialogConfirmPassword && (
                            <div className="input-box">
                                <p>Tu Contraseña se ha cambiado exitosamente.</p>

                                <Link to={'/login'} className='button-login'>Login</Link>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    )
}
