import React, { useContext, useEffect, useState } from 'react';
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
import { TabsStepsTickets } from './TabsStepsTickets';
import { Tab } from 'react-bootstrap';
import { useCounter } from '../../hooks/useCounter';
import { TicketContext } from '../../context/ticketContext';
import { types } from '../../types/types';
import './GeneracionTicket.css';

const UrlGeneracionTickets = environment.UrlGeneracionManyTickets;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    idUsuario: Yup.number().required('El Usuario es requerido').min(1, 'Debe seleccionar un Usuario'),
    idEvento: Yup.number().required('El Evento es requerido').min(1, 'Debe seleccionar un Evento'),
    idSector: Yup.number().required('El Sector es requerido').min(1, 'Debe seleccionar un Sector'),
    idMedioPago: Yup.number().required('El Medio Pago es Requerido').min(1, 'Debe seleccionar un Medio Pago'),
    montoPago: Yup.number().required().min(1, 'Debe seleccionar a lo menos 1 ticket para generar el proceso')
    
});

export const GeneracionTicket = () => {
    const { ticketState, ticketDispatch } = useContext(TicketContext);
    const [ base64Pdf, setBase64Pdf ] = useState("");
    const [ isOpen, setIsOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ activeTab, setActiveTab ] = useState('cliente');
    const { counter, increment, decrement } = useCounter(0);

    useEffect(() => {
        ticketDispatch({type: types.resetFormValues});
    }, []);

    useEffect(() => {
        formik.setValues(ticketState.formValues); 
    }, [ticketState.formValues]);

    const closeModal = () => setIsOpen(false);
    const openModal = () => setIsOpen(true);
    
    const formik = useFormik({
        initialValues: ticketState.formValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.montoTotal = values.montoPago;
            let fecha = new Date();
            values.fechaTicket = fecha;
            
            let ticketList = [];

            for (let i = 0; i < counter; i++) {
                let ticket = {
                    idUsuario: values.idUsuario,
                    idEvento: values.idEvento,
                    idSector: values.idSector,
                    idMedioPago: values.idMedioPago,
                    montoPago: values.montoPago / counter,
                    montoTotal: values.montoPago / counter,
                    fechaTicket: values.fechaTicket,
                    activo: values.activo
                };
                ticketList.push(ticket);
            }
            setLoading(true);
            try {
                const response = await axios.post(UrlGeneracionTickets, ticketList, {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                    },
                });

                if (response.status === 200) {
                    openModal();
                    setBase64Pdf(response.data);
                    setLoading(false);
                    formik.resetForm();
                    ticketDispatch({type: types.resetFormValues});
                }
            } catch (error) {
                console.error('API error:', error);
                setLoading(false);
            }
        },
    });

    const handleNextTabs = () => {
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
                            <CardInfoCliente  /> 
                            {formik.touched.idUsuario && formik.errors.idUsuario ? (
                                        <div style={{color:'red'}}>{formik.errors.idUsuario}</div>
                                        ) : null}
                        </Tab.Pane>

                        <Tab.Pane eventKey="tickets">
                            <CardInfoEvento 
                                counter={counter}
                                increment={increment}
                                decrement={decrement}
                            /> 
                            {formik.touched.idEvento && formik.errors.idEvento ? (
                                        <div style={{color:'red'}}>{formik.errors.idEvento}</div>
                                        ) : null}

                            {formik.touched.idSector && formik.errors.idSector ? (
                                        <div style={{color:'red'}}>{formik.errors.idSector}</div>
                                        ) : null}
                        </Tab.Pane>

                        <Tab.Pane eventKey="pago">
                            <CardInfoMedioPago />
                            {formik.touched.idMedioPago && formik.errors.idMedioPago ? (
                                        <div style={{color:'red'}}>{formik.errors.idMedioPago}</div>
                                        ) : null}
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
                                        disabled={true}
                                    />
                                    {formik.touched.montoPago && formik.errors.montoPago ? (
                                        <div style={{color:'red'}}>{formik.errors.montoPago}</div>
                                        ) : null}
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
                <button id='btnSiguiente' type='button' className='btn btn-primary' hidden={activeTab === 'pago'} disabled={activeTab === 'pago'} onClick={handleNextTabs}>Continuar</button>
            </div>
            {   loading ? <Loader /> : 
                    <ModalTicket isOpen={isOpen} closeModal={closeModal} base64Pdf={base64Pdf} />
            }
        </div>
    )
}