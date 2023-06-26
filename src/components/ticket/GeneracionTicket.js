import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {Buffer} from 'buffer';
import { ModalTicket } from './ModalTicket';
import { environment } from '../../environment/environment.dev';
import { basicAuth} from '../../types/basicAuth';
import { CardInfoCliente } from './CardInfoCliente';
import { CardInfoEvento } from './CardInfoEvento';
import { CardInfoMedioPago } from './CardInfoMedioPago';
import { Loader } from '../ui/loader/Loader';

const UrlGeneracionTicket = environment.UrlGeneracionTicket;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object({
    // Agrega tus reglas de validación aquí, si las necesitas
      // email: Yup.string().email('Invalid email address').required('Required'),
    // password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });

export const GeneracionTicket = () => {
    const [base64Pdf, setBase64Pdf] = useState("");
    const [valueUsuario, setValueUsuario] = useState();
    const [valueEvento, setValueEvento] = useState();
    const [valueSector, setValueSector] = useState();
    const [valueMedioPago, setValueMedioPago] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
            values.idUsuario = valueUsuario;
            values.idEvento = valueEvento;
            values.idSector = valueSector;
            values.idMedioPago = valueMedioPago;
            values.montoTotal = values.montoPago;
            var fecha = new Date();
            values.fechaTicket = fecha;
            values.activo = true;

            setLoading(true);
    
            try {
                const response = await axios.post(UrlGeneracionTicket, values, {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                    },
                });
               openModal();
               setBase64Pdf(response.data);
               setLoading(false);
               
            } catch (error) {
                console.error('API error:', error);
                setLoading(false);
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
                <div className="row">
                    <div className="col-sm-4">
                        <CardInfoCliente valueUsuario={valueUsuario} setValueUsuario={setValueUsuario}/>
                    </div>
                    <div className="col-sm-4">
                    <CardInfoEvento valueEvento={valueEvento} setValueEvento={setValueEvento} valueSector={valueSector} setValueSector={setValueSector}/>
                       
                    </div>

                    <div className="col-sm-4">
                        <CardInfoMedioPago valueMedioPago={valueMedioPago} setValueMedioPago={setValueMedioPago} />

                        <div className="col-lg-12">
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
                        <br/>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-outline-info" disabled={loading}><i className="bi bi-save2"></i> Generar </button>
                        </div>
                    </div>
                </div>
               
            </form>
            {   loading ? <Loader /> : 
                    <ModalTicket isOpen={isOpen} closeModal={closeModal} base64Pdf={base64Pdf} />
            }
        </div>
    )
}
