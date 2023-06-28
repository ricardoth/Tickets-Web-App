import React, { useEffect, useState } from 'react'
import { Combobox } from '../ui/combobox/Combobox';
import { environment } from '../../environment/environment.dev';
import { parserUsuario } from '../../types/parsers';
import { basicAuth} from '../../types/basicAuth';
import {Buffer} from 'buffer';
import axios from 'axios';

const UrlGetUsuarios = environment.UrlGetUsuarios;
const UrlGetUsuarioTicket = environment.UrlGetUsuario;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const CardInfoCliente = ({valueUsuario, setValueUsuario, continuar, setContinuar}) => {
    const [correoUser, setCorreoUser] = useState("");
    const [telefonoUser, setTelefonoUser] = useState("");
    const [direccionUser, setDireccionUser] = useState("");

    useEffect(() => {
        if (valueUsuario !== undefined || valueUsuario > 0) {
            
            axios.get(UrlGetUsuarioTicket + `${valueUsuario}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            })
            .then(response => {
                let {data} = response.data;
                let { idUsuario, correo, telefono, direccion} = data;
                setValueUsuario(idUsuario);
                setCorreoUser(correo);
                setTelefonoUser(telefono);
                setDireccionUser(direccion);
                setContinuar(false);
            })
            .catch(err => {
                console.error("Ha ocurrido un error al realizar la Petición a API", err);
            });
        }
    }, [valueUsuario]);

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Información del Cliente</h5>
                    <p className="card-text">Complete para continuar con la compra</p>

                    <div className="row">
                        <div className='col-lg-6'>
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
                        </div>

                        <div className='col-lg-6'>
                            <p className="card-text">Correo: <span className='fw-bold'>{correoUser}</span></p>
                            <p className="card-text">Teléfono: <span className='fw-bold'>{telefonoUser}</span></p>
                            <p className="card-text">Dirección: <span className='fw-bold'>{direccionUser}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
