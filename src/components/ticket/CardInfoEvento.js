import React, { useEffect, useState } from 'react'
import {parserEvento, parserSector} from '../../types/parsers';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';
import { basicAuth} from '../../types/basicAuth';
import {Buffer} from 'buffer';
import axios from 'axios';

const UrlGetEventos = environment.UrlGetEventos;
const UrlGetSectores = environment.UrlGetSectoresByEvento;

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
    const [ isVisibleFlyer, setIsVisibleFlyer ] = useState(true);

    useEffect(() => {
        setValueEvento(valueEvento);

        if (valueEvento !== undefined && valueEvento != 0)
        {
            axios.get(UrlGetSectores + `${valueEvento}`, {
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
                setEvento(data);
                console.log(data)
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

                    <div className="col-lg-12">
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
                            <div className='col-lg-12'>
                                <div className='card'>
                                    <img hidden={isVisibleFlyer} src={`data:image/jpeg;base64, ${evento.flyer}`}  alt="Imagen base64"  
                                        style = {{width:"100%", height:"70%",}} 
                                    />
                                     <div className="card-body">
                                        <p className='fw-bold'>Lugar:</p>
                                        { isVisibleFlyer ? "": 
                                            (
                                                <div>
                                                    <p className="card-text ">{evento.lugar.nombreLugar}</p>
                                                    <p className="card-text">{evento.lugar.ubicacion} #{evento.lugar.numeracion}</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="col-lg-12">
                        <label>Sector</label>
                        {
                            valueEvento && (
                                <select value={valueSector} onChange={handleSectorChange} className='custom-select form-control'>
                                    <option value="">---Seleccione---</option>
                                    { sectores.map((sector) => (
                                        <option key={sector.idSector} value={sector.idSector}>{sector.nombreSector}</option>
                                    )) }
                                </select>
                            )
                        }
                    </div>
                    <br />
                    <div className="col-lg-12">Ubicación</div>
                </div>
            </div>
        </>
    )
}
