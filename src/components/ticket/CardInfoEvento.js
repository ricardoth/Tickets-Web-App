import React, { useEffect } from 'react'
import {parserEvento, parserSector} from '../../types/parsers';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';

const UrlGetEventos = environment.UrlGetEventos;
const UrlGetSectores = environment.UrlGetSectores;

export const CardInfoEvento = ({valueEvento, setValueEvento, valueSector, setValueSector}) => {
    useEffect(() => {
        setValueEvento(valueEvento);
      }, [valueEvento]);

    useEffect(() => {
        setValueSector(valueSector);
    }, [valueSector]);
  
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Información del Evento</h5>
                    <p className="card-text">Seleccione los datos del evento, sector y formas de pago para completar la compra</p>

                    <div className="col-lg-12">
                        <label>Usuario</label>
                    
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
        </>
    )
}
