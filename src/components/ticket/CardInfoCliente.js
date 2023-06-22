import React, { useEffect, useState } from 'react'
import { Combobox } from '../ui/combobox/Combobox';
import { environment } from '../../environment/environment.dev';
import { parserUsuario } from '../../types/parsers';

const UrlGetUsuarios = environment.UrlGetUsuarios;

export const CardInfoCliente = ({valueUsuario, setValueUsuario}) => {
    useEffect(() => {
      setValueUsuario(valueUsuario);
    }, [valueUsuario]);

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Información del Cliente</h5>
                    <p className="card-text">Complete para continuar con la compra</p>

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

                        <p className="card-text">Correo:</p>
                        <p className="card-text">Teléfono:</p>
                        <p className="card-text">Dirección:</p>
                    </div>
                </div>
            </div>
        </>
    )
}
