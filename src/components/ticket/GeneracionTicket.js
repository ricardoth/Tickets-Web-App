import React, { useEffect, useState } from 'react';
import { ErrorMessage, move, useFormik } from 'formik';
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
import Swal from 'sweetalert2';

const UrlGeneracionTicket = environment.UrlGeneracionTicket;
const UrlGeneracionTickets = environment.UrlGeneracionManyTickets;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    // Agrega tus reglas de validación aquí, si las necesitas
    // montoPago: Yup.number().moreThan(0, 'Debe seleccionar a lo menos 1 entrada')
    // idUsuario: Yup.string().required('El ID del usuario es requerido'),
    // idEvento: Yup.string().required('El ID del evento es requerido'),
    // idSector: Yup.string().required('El ID del sector es requerido'),
    
  });

export const GeneracionTicket = () => {
    const [base64Pdf, setBase64Pdf] = useState("");
    const [valueUsuario, setValueUsuario] = useState(0);
    const [valueEvento, setValueEvento] = useState(0);
    const [valueSector, setValueSector] = useState(0);
    const [valueMedioPago, setValueMedioPago] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [continuar, setContinuar] = useState(true);
    const [activeTab, setActiveTab] = useState('cliente');
    const [total, setTotal] = useState(0);
    const { counter, increment, decrement } = useCounter(0);

    const closeModal = () => {
        setIsOpen(false);
    };
  
    const openModal = () => {
        setIsOpen(true);
    };
    
    const formik = useFormik({
        initialValues: {
            idUsuario: valueUsuario,
            idEvento: valueEvento,
            idSector: valueSector,
            idMedioPago: valueMedioPago,
            montoPago: total,
            montoTotal: total,
            fechaTicket: '',
            activo: false,
        },
        validationSchema: validationSchema,
        
        onSubmit: async (values) => {
            values.idUsuario = valueUsuario;
            values.idEvento = valueEvento;
            values.idSector = valueSector;
            values.idMedioPago = valueMedioPago;
            values.montoPago = total;
            values.montoTotal = total;
            let fecha = new Date();
            values.fechaTicket = fecha;
            values.activo = true;

            if(values.idUsuario != 0 && values.idEvento != 0 && values.idSector != 0 && values.idMedioPago != 0 && values.montoTotal > 0)
            {
                let ticketList = [];

                for (let i = 0; i < counter; i++) {
                    let ticket = {
                        idUsuario: values.idUsuario,
                        idEvento: values.idEvento,
                        idSector: values.idSector,
                        idMedioPago: values.idMedioPago,
                        montoPago: total / counter,
                        montoTotal: total / counter,
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

                    openModal();
                    setBase64Pdf(response.data);
                    setLoading(false);
                    formik.resetForm();
                } catch (error) {
                    console.error('API error:', error);
                    setLoading(false);
                }
            } else {

                Swal.fire('Debe completar los campos para generar los tickets!', '', 'error');
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
                            <CardInfoEvento 
                                valueEvento={valueEvento} 
                                setValueEvento={setValueEvento} 
                                valueSector={valueSector} 
                                setValueSector={setValueSector}
                                total={total}
                                setTotal={setTotal}
                                counter={counter}
                                increment={increment}
                                decrement={decrement}
                            /> 
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
                                        value={total}
                                        onChange={formik.handleChange}
                                        className="form-control" 
                                        disabled={true}
                                    />

                                    {formik.touched.idMedioPago && formik.errors.idMedioPago ? (
                                        <div>{formik.errors.idMedioPago}</div>
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
                <button id='btnSiguiente' className='btn btn-primary' hidden={activeTab === 'pago'} disabled={activeTab === 'pago'} onClick={handleNextTabs}>Continuar</button>
            </div>
            {   loading ? <Loader /> : 
                    <ModalTicket isOpen={isOpen} closeModal={closeModal} base64Pdf={base64Pdf} />
            }
        </div>
    )
}
