import React, { useContext, useState } from 'react'
import {parserEvento} from '../../types/parsers';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';
import { basicAuth} from '../../types/basicAuth';
import {Buffer} from 'buffer';
import axios from 'axios';
import { CardCountTicket } from './CardCountTicket';
import { formatDateLocaleString } from '../../types/formatDate';
import { TicketContext } from '../../context/ticketContext';
import { types } from '../../types/types';
import { ImageFlyer } from '../ui/imageLoad/ImageFlyer';

const UrlGetEventos = environment.UrlGetEventos;
const UrlGetSectores = environment.UrlGetSectores;
const UrlGetSectoresByEvento = environment.UrlGetSectoresByEvento;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const CardInfoEvento = ({counter, increment, decrement}) => {
    const { ticketState, ticketDispatch } = useContext(TicketContext);
    const [sectores, setSectores] = useState([]);
    const [evento, setEvento] = useState({
        idEvento: '',
        idLugar: '',
        nombreEvento: '',
        direccion: '',
        fecha: '',
        flyer: '',
        activo: false,
        lugar: {
            nombreLugar: '',
            ubicacion: '',
            numeracion: ''
        }
    });
    const [sector, setSector] = useState({
        idSector: '',
        idEvento: '',
        nombreSector: '',
        capacidadDisponible: '',
        capacidadActual: '',
        capacidadTotal: '',
        precio: '',
        activo: false,
    });
    const [ isVisibleFlyer, setIsVisibleFlyer ] = useState(true);

    const fetchSectorsByEvent = async (id) => {
        await axios.get(UrlGetSectoresByEvento + `${id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        })
        .then(response => {
            setSectores(response.data.data);
        })
        .catch(err => {
            console.error("Ha ocurrido un error al realizar la Petición a API", err);
        });

    }
    const fetchEventoById = async (id) => {
        await axios.get(UrlGetEventos + `/${id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        })
        .then(response => {
            const { data } = response.data;
            data.fecha = formatDateLocaleString(data.fecha);
            setEvento(data);
            setIsVisibleFlyer(false);
        })
        .catch(err => {
            resetStateEvento();
            console.error("Ha ocurrido un error al realizar la Petición a API", err);
        });
    }

    const fetchSectorById = async (id) => {
        await axios.get(UrlGetSectores + `/${id}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        })
        .then(response => {
            const { data } = response.data;
            setSector(data);
        })
        .catch(err => {
            console.error("Ha ocurrido un error al realizar la Petición a API", err);
        });
    }
  
    const resetStateEvento = () => {
        setEvento({
            idEvento: '',
                idLugar: '',
                nombreEvento: '',
                direccion: '',
                fecha: '',
                flyer: '',
                activo: false,
                lugar: {
                    nombreLugar: '',
                    ubicacion: '',
                    numeracion: ''
                }
        });
    }

    const handleChangeEvento = ({target}) => {
        ticketDispatch({type: types.updateIdEventoValue, payload: target.value});
        if (target.value > 0) {
            fetchSectorsByEvent(target.value);
            fetchEventoById(target.value);
        } else 
            setIsVisibleFlyer(true);
        
    };
    
    const handleChangeSector = ({target}) => {
        ticketDispatch({type: types.updateIdSectorValue, payload: target.value})
        if (target.value > 0) {
            fetchSectorById(target.value);
        } else 
            ticketDispatch({type: types.updateIdSectorValue, payload: 0})

    };

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Información del Evento</h5>
                    <p className="card-text">Seleccione los datos del evento, sector y formas de pago para completar la compra</p>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <label>Evento</label>
                    
                            <Combobox
                                id="idEvento"
                                name="idEvento"
                                value={ticketState.formValues.idEvento}
                                setValue={handleChangeEvento}
                                url={UrlGetEventos}
                                parser={parserEvento}
                                tipoAuth={environment.BasicAuthType}
                            /> 
                            
                            {
                                ticketState.formValues.idEvento === 0 ? "" : (
                                    <div className='row'>
                                        <div className='col-lg-6'>
                                            <div className='card'>
                                                <ImageFlyer isVisible={isVisibleFlyer} image={evento.contenidoFlyer} classname={"img-fluid img-thumbnail"} style={{width:"100%", height:"100%",}} />
                                            </div>
                                        </div>
                                        <div className='col-lg-6'>
                                            <div className='card'>
                                            
                                                <div className="card-body">
                                                    <p className='fw-bold'>Lugar:</p>
                                                    { isVisibleFlyer ? "": 
                                                        (
                                                            <div>
                                                                <p className="card-text">{evento.lugar.nombreLugar}</p>
                                                                <p className="card-text">{evento.lugar.ubicacion} #{evento.lugar.numeracion}</p>
                                                                <p className='card-text'>Fecha: {evento.fecha}</p> 

                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-lg-6">
                            {
                                 ticketState.formValues.idEvento === 0 ? "" : (
                                    <div>
                                        <label>Selecciona tu Sector</label>
                                        <select id="idSector" value={ticketState.formValues.idSector} onChange={handleChangeSector} className='custom-select form-control'>
                                            <option value="">---Seleccione---</option>
                                            { sectores.map((sector) => (
                                                <option key={sector.idSector} value={sector.idSector}>{sector.nombreSector}</option>
                                            )) }
                                        </select>

                                        {
                                            ticketState.formValues.idSector === 0 ? "" : (
                                                <div className='row mt-3'>
                                                    <div className='col-lg-12'>
                                                        <div className='card'>
                                                            <div className="card-body">
                                                                <div>
                                                                    <p className="card-text"> <span className='fw-bold'>Sector:</span> {sector.nombreSector}</p>
                                                                    <div className="row align-items-center mt-2 d-none d-sm-flex">
                                                                        <p className="card-text">Capacidad Máxima: {sector.capacidadTotal}</p>
                                                                        <CardCountTicket 
                                                                            sectorValue={sector}
                                                                            counter={counter} 
                                                                            increment={increment} 
                                                                            decrement={decrement} 
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        }
                                    </div>    
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
