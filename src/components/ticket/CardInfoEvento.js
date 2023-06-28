import React, { useEffect, useState } from 'react'
import {parserEvento, parserSector} from '../../types/parsers';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';
import { basicAuth} from '../../types/basicAuth';
import {Buffer} from 'buffer';
import axios from 'axios';
import { CardCountTicket } from './CardCountTicket';

const UrlGetEventos = environment.UrlGetEventos;
const UrlGetSectores = environment.UrlGetSectores;
const UrlGetSectoresByEvento = environment.UrlGetSectoresByEvento;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const CardInfoEvento = ({valueEvento, setValueEvento, valueSector, setValueSector}) => {
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
        idLugar: '',
        nombreSector: '',
        capacidad: '',
        activo: false,
    });
    const [ isVisibleFlyer, setIsVisibleFlyer ] = useState(true);

    useEffect(() => {
        setValueEvento(valueEvento);

        if (valueEvento !== undefined && valueEvento != 0)
        {
            axios.get(UrlGetSectoresByEvento + `${valueEvento}`, {
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


            axios.get(UrlGetEventos + `/${valueEvento}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            })
            .then(response => {
                const { data } = response.data;
                let fecha = new Date(data.fecha);
                const opciones = { year: 'numeric', month: 'long', day: '2-digit' };
                const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones).replace(/\//g, '-');
                data.fecha = fechaFormateada;
                setEvento(data);
                setIsVisibleFlyer(false);
            })
            .catch(err => {
                resetStateEvento();
                console.error("Ha ocurrido un error al realizar la Petición a API", err);
            });
        }else{
            resetStateEvento();
            setIsVisibleFlyer(true);
        }

        
    }, [valueEvento]);

    useEffect(() => {
        if (valueEvento !== undefined || valueEvento > 0)
        {
            axios.get(UrlGetSectores + `/${valueSector}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            })
            .then(response => {
                const { data } = response.data;
                setSector(data);
                // setIsVisibleFlyer(false);
            })
            .catch(err => {
                // resetStateEvento();
                console.error("Ha ocurrido un error al realizar la Petición a API", err);
            });
        }
        
    }, [valueSector])
    

    const handleSectorChange = (e) => {
        setValueSector(e.target.value);
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
                                value={valueEvento}
                                setValue={setValueEvento}
                                url={UrlGetEventos}
                                parser={parserEvento}
                                tipoAuth={environment.BasicAuthType}
                            /> 
                            
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div className='card'>
                                        <img hidden={isVisibleFlyer} src={`data:image/jpeg;base64, ${evento.flyer}`}  className='img-fluid img-thumbnail' alt="Imagen base64"  
                                            style = {{width:"100%", height:"100%",}} 
                                        />
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
                        </div>
                        

                        <div className="col-lg-6">
                           
                            {
                                 valueEvento && (
                                    <div>
                                        <label>Selecciona tu Sector</label>
                                        <select value={valueSector} onChange={handleSectorChange} className='custom-select form-control'>
                                            <option value="">---Seleccione---</option>
                                            { sectores.map((sector) => (
                                                <option key={sector.idSector} value={sector.idSector}>{sector.nombreSector}</option>
                                            )) }
                                        </select>

                                        <div className='row mt-3'>
                                            <div className='col-lg-12'>
                                                <div className='card'>
                                                    <div className="card-body">
                                                        <div>
                                                            <p className="card-text"> <span className='fw-bold'>Sector:</span> {sector.nombreSector}</p>

                                                            
                                                            <div className="row align-items-center mt-2 d-none d-sm-flex">
                                                                <p className="card-text">Capacidad Máxima: {sector.capacidad}</p>
                                                                <CardCountTicket />
                                                          

                                                            </div>


                                                            <table className='table'>
                                                                <thead>
                                                                    <tr>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
