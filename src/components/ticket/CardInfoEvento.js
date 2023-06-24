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
    const [eventoResponse, setEventoResponse] = useState({});
    const [ isVisibleFlyer, setIsVisibleFlyer ] = useState(true);

    useEffect(() => {
        setValueEvento(valueEvento);
        console.log(isVisibleFlyer)

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
                setEventoResponse(data);
                console.log(data)
                setIsVisibleFlyer(false);
            })
            .catch(err => {
                setEventoResponse("");
                console.error("Ha ocurrido un error al realizar la Petición a API", err);
            });
        }else{
            setEventoResponse("");
            setIsVisibleFlyer(true);
        }

        
    }, [valueEvento]);


    const handleSectorChange = (e) => {
        setValueSector(e.target.value);
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
                        
                        <label>Flyer</label>
                        <div className='col-lg-12'> 

                            <img hidden={isVisibleFlyer} src={`data:image/jpeg;base64, ${eventoResponse.flyer}`}  alt="Imagen base64"  
                                style = {{width:"50%", height:"50%", border:"3px solid black", justifyContent: 'center', alignItems: 'center'}} 
                            />
                            <p className="card-text">Lugar: <span className='fw-bold'>{eventoResponse.direccion}</span></p>
                            
                        </div>
                        {/* <div className='col-lg-6'>
                            <p className="card-text">Lugar: <span className='fw-bold'>{eventoResponse.idLugar}</span></p>
                        </div> */}
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
