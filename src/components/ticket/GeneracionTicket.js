import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import {Buffer} from 'buffer';
import { Combobox } from '../ui/combobox/Combobox';
import { ModalTicket } from './ModalTicket';
import { environment } from '../../environment/environment.dev';
import { basicAuth} from '../../types/basicAuth';
import {parserUsuario, parserEvento, parserMedioPago, parserSector} from '../../types/parsers';

const UrlGeneracionTicket = environment.UrlGeneracionTicket;
const UrlGetUsuarios = environment.UrlGetUsuarios;
const UrlGetEventos = environment.UrlGetEventos;
const UrlGetSectores = environment.UrlGetSectores;
const UrlGetMedioPagos = environment.UrlGetMedioPagos;
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
    
            try {
                const response = await axios.post(UrlGeneracionTicket, values, {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
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
                <div class="row">
                    <div class="col-sm-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Información del Cliente</h5>
                                <p class="card-text">Complete para continuar con la compra</p>

                                <div className="col-lg-12">
                                    <label>Usuario</label>
                                
                                    <Combobox
                                        id="idUsuario"
                                        name="idUsuario"
                                        value={valueUsuario}
                                        setValue={setValueUsuario}
                                        url={UrlGetUsuarios}
                                        parser={parserUsuario}
                                        tipoAuth={environment.BasicAuthType}
                                    /> 

                                    <p class="card-text">Correo:</p>
                                    <p class="card-text">Teléfono:</p>
                                    <p class="card-text">Dirección:</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Información del Evento</h5>
                                <p class="card-text">Seleccione los datos del evento, sector y formas de pago para completar la compra</p>

                                <div className="col-lg-12">
                                    <Combobox
                                        id="idEvento"
                                        name="idEvento"
                                        value={valueEvento}
                                        setValue={setValueEvento}
                                        url={UrlGetEventos}
                                        parser={parserEvento}
                                        tipoAuth={environment.BasicAuthType}
                                    /> 
                                    
                                </div>
                                <label>Evento</label>

                                <div className="col-lg-12">Nombre, Lugar</div>

                                <div className="col-lg-12">
                                    <label>Sector</label>
                                    <Combobox
                                            id="idSector"
                                            name="idSector"
                                            value={valueSector}
                                            setValue={setValueSector}
                                            url={UrlGetSectores}
                                            parser={parserSector}
                                            tipoAuth={environment.BasicAuthType}
                                        /> 
                                </div>

                                <div className="col-lg-12">Ubicación</div>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Forma de Pago</h5>
                                <p class="card-text">Seleccione el método de pago que utilizará</p>

                                <div className="col-lg-12">
                                    <label>MedioPago</label>
                                    <Combobox
                                            id="idMedioPago"
                                            name="idMedioPago"
                                            value={valueMedioPago}
                                            setValue={setValueMedioPago}
                                            url={UrlGetMedioPagos}
                                            parser={parserMedioPago}
                                            tipoAuth={environment.BasicAuthType}
                                        /> 
                                </div>

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
                                <div class="d-grid gap-2">
                                    <button type="submit" className="btn btn-outline-info"><i class="bi bi-save2"></i> Generar</button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                
            </form>

            <ModalTicket isOpen={isOpen} closeModal={closeModal} base64Pdf={base64Pdf} />
        </div>
    )
}
