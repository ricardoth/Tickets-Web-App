import { useFormik } from 'formik';
import { MdEmail } from 'react-icons/md';
import { useState } from 'react';
import { environment } from '../../environment/environment.dev';
import './Form.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Loader } from '../ui/loader/Loader';
const UrlRequestChangePassword = environment.UrlRequestChangePassword;
const codigoApp = environment.ID_APP;

export const RequestChangePassword = () => {
    const [ dialogConfirmPassword, setDialogConfirmPassword ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const formik = useFormik({
        initialValues: {
            correo: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            let objValues = {
                correo: values.correo,
                idApp: codigoApp
            }

            await axios.post(UrlRequestChangePassword, 
                objValues
            ).then(res => {
                if(res.status === 200) {
                    const response = res.data;
                    //Setear context para pasar correo a la otra pantalla
                    localStorage.setItem('correo', values.correo);
                    setDialogConfirmPassword(true);
                } 
            })
            .catch(err => {
                Swal.fire('Atención', `${err.response.data}`, 'error');
            });
            formik.resetForm();
            setLoading(false);
        } 
    });

    return (
        <div>
            <section id='section'>
                <div className="login-box">
                    <form onSubmit={formik.handleSubmit}>

                        {!dialogConfirmPassword && (
                        <div>
                            <h4>¿Olvidaste tu Contraseña?</h4>
                            <div className="input-box">
                                <span className="icon">
                                    <MdEmail />
                                </span>
                                <input 
                                    type="email" 
                                    name='correo' 
                                    placeholder='Ingresa tu Email' 
                                    autoComplete="off" 
                                    onChange={formik.handleChange} 
                                    value={formik.values.correo}
                                    required
                                />
                            </div>
                            {
                                loading ? <Loader /> : (
                                    <button type='submit' className='button-login'>
                                        Solicitar Contraseña
                                    </button>
                                )
                            }
                         </div>
                        )}

                        { dialogConfirmPassword && (
                            <div className="input-box">
                                <p>Se ha enviado un email a {formik.values.correo} con el link para restablecer la contraseña</p>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    )
}
