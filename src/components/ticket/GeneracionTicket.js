import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import {Buffer} from 'buffer';
import { Combobox } from '../ui/combobox/Combobox';
import { ModalTicket } from './ModalTicket';
import { environment } from '../../environment/environment.dev';

const UrlGeneracionTicket = environment.UrlGeneracionTicket;
const basicAuth = {
    username: environment.UserBasicAuth,
    password: environment.PasswordBasicAuth
};

const validationSchema = Yup.object({
    // Agrega tus reglas de validación aquí, si las necesitas
      // email: Yup.string().email('Invalid email address').required('Required'),
    // password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });

export const GeneracionTicket = () => {
    const [modalTicket, setModalTicket] = useState(false);
    const [base64Pdf, setBase64Pdf] = useState("");
  
    const [isOpen, setIsOpen] = useState(false);
  
    const closeModal = () => {
      setIsOpen(false);
    };
  
    const openModal = () => {
      setIsOpen(true);
    };
    const formik = useFormik({
        initialValues: {
          idUsuario: '',
          idEvento: '',
          idSector: '',
          idMedioPago: '',
          montoPago: '',
          montoTotal: '',
          fechaTicket: '',
          activo: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
          console.log('Form data:', values);
    
          values.idMedioPago = 1;
          values.montoTotal = values.montoPago;
          var fecha = new Date();
    
          values.fechaTicket = fecha;
        
          values.activo = true;
    
            try {
                const response = await axios.post(UrlGeneracionTicket, values, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${basicAuth.username}:${basicAuth.password}`).toString('base64')}`,
                },
            });
        
               openModal();
               setBase64Pdf(response.data);
        
            } catch (error) {
                console.error('API error:', error);
            }
        },
    });


    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
            <h1>Generación de Tickets</h1>
            </div>
            <hr/>


            <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                <div className='row'>
                    <div className="col-lg-6">
                        <label>Usuario</label>
                        <input 
                            type="text" 
                            id="idUsuario"
                            placeholder="Usuario" 
                            className="form-control" 
                            onChange={formik.handleChange}
                            name="idUsuario"
                            autoComplete="off"
                            />
                    </div>
                    <div className="col-lg-6">
                        <label>Evento</label>
                        <input 
                            type="text" 

                            id="idEvento"
                            name="idEvento"
                            value={formik.values.idEvento}
                            onChange={formik.handleChange}
                            className="form-control" 
                            autoComplete="off"
                            />
                    </div>
                    
                </div>
                <br />
                <div className='row'>
                    <div className="col-lg-6">
                        <label>Sector</label>
                        <input 
                            type="text" 

                            id="idSector"
                            name="idSector"
                            value={formik.values.idSector}
                            onChange={formik.handleChange}
                            className="form-control" 
                            autoComplete="off"
                            />
                        {/* <Combobox
                            id={"todos"}
                            value={valuePadre}
                            // defaultValue={formValues.padre} 
                            setValue={setValuePadre}
                            url={endpointPadre}
                            parser={parser}
                        /> */}
                    </div>

                    <div className="col-lg-6">
                        <label>MedioPago</label>
                        <input 
                            type="text" 

                            id="idMedioPago"
                            name="idMedioPago"
                            value={formik.values.idMedioPago}
                            onChange={formik.handleChange}
                            className="form-control" 
                            autoComplete="off"
                            />
                    </div>

                    {/* <div className="col-lg-6">
                        <label>Vigencia</label>
                        <div>
                            <label className="toggle-switch">
                                <Switch
                                    id="1"
                                    isOn={esActivo}
                                    onToggle={onToggleActivo}
                                />
                            </label>
                        </div>
                    </div> */}
                </div>
                <div className='row'>
                    <div className="col-lg-6">
                        <label>Valor</label>
                        <input 
                            type="text" 
                            id="montoPago"
                            name="montoPago"
                            value={formik.values.montoPago}
                            onChange={formik.handleChange}
                            className="form-control" 
                            placeholder='$'
                            autoComplete="off"
                            />
                    </div>
                </div>

            
                <div className='modal-footer'>
                    <button type="submit" className="btn btn-primary">Aceptar</button>
                </div>
            </form>

            <ModalTicket isOpen={isOpen} closeModal={closeModal} base64Pdf={base64Pdf} />
        </div>
    )
}
