import React, { useEffect, useState } from 'react';
import { move, useFormik } from 'formik';
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
import { TabsStepsTickets } from './TabsStepsTickets';
import { Tab } from 'react-bootstrap';

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
    const [continuar, setContinuar] = useState(true);
    const [activeTab, setActiveTab] = useState('cliente');

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

    const handleNextTabs = () => {
        setContinuar(true);
        switch (activeTab) {
            case 'cliente':
                setActiveTab('tickets');                
                break;
        
            case 'tickets':
                setActiveTab('pago');
                break;
            default:
                break;
        }
    }


    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Generación de Tickets</h1>
            </div>
            <hr/>

            <Tab.Container activeKey={activeTab}>
                <TabsStepsTickets activeTab={activeTab} setActiveTab={setActiveTab} />
                <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                    <Tab.Content>
                        <Tab.Pane eventKey="cliente">
                            <CardInfoCliente valueUsuario={valueUsuario} setValueUsuario={setValueUsuario} continuar={continuar} setContinuar={setContinuar}/>
                        </Tab.Pane>

                        <Tab.Pane eventKey="tickets">
                            <CardInfoEvento valueEvento={valueEvento} setValueEvento={setValueEvento} valueSector={valueSector} setValueSector={setValueSector}/>
                        </Tab.Pane>

                        <Tab.Pane eventKey="pago">
                            <CardInfoMedioPago valueMedioPago={valueMedioPago} setValueMedioPago={setValueMedioPago} />
                                <br/>
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
                                <div className="d-grid gap-2 ">
                                    <button type="submit" className="btn btn-outline-info" disabled={loading}><i className="bi bi-save2"></i> Generar </button>
                                </div>
                        </Tab.Pane>
                    </Tab.Content>
                    <br />
                </form>

            </Tab.Container>

            
            

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button id='btnSiguiente' className='btn btn-primary' disabled={activeTab === 'pago'} onClick={handleNextTabs}>Continuar</button>
            </div>
            {   loading ? <Loader /> : 
                    <ModalTicket isOpen={isOpen} closeModal={closeModal} base64Pdf={base64Pdf} />
            }
        </div>
    )
}
