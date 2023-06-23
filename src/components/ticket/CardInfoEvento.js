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

    useEffect(() => {
        setValueEvento(valueEvento);

        if (valueEvento !== undefined)
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
                        
                        <label>Evento</label>
                    </div>
                    <br />
                    <div className="col-lg-12">Nombre, Lugar</div>
                    <br />
                    
                    <div className="col-lg-12">
                        <label>Sector</label>
                        {
                            valueEvento && (
                                // <Combobox
                                //     id="idSector"
                                //     name="idSector"
                                //     value={valueSector}
                                //     setValue={setValueSector}
                                //     url={UrlGetSectores}
                                //     parser={parserSector}
                                //     tipoAuth={environment.BasicAuthType}
                                // /> 
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
