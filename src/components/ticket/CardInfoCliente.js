import React, { useEffect, useState } from 'react'
import { environment } from '../../environment/environment.dev';
import { basicAuth} from '../../types/basicAuth';
import {Buffer} from 'buffer';
import axios from 'axios';
import Select from 'react-select';

// const UrlGetUsuarios = environment.UrlGetUsuarios;
const UrlGetUsuarioTicket = environment.UrlGetUsuario;
const UrlGetUsuariosFilter = environment.UrlGetUsuariosFilter;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const CardInfoCliente = ({valueUsuario, setValueUsuario, continuar, setContinuar}) => {
    const [correoUser, setCorreoUser] = useState("");
    const [telefonoUser, setTelefonoUser] = useState("");
    const [direccionUser, setDireccionUser] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);

    const fetchUsuarios = async (inputValue) => {
        try {
            const response = await axios.get(UrlGetUsuariosFilter + `?filtro=${inputValue}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });

            const { data } = response.data;
            const newOptions = data.map((item) => ({
                value: item.idUsuario,
                label: item.nombres +' '+ item.apellidoP + ' '+ item.apellidoM
            }));

            setOptions(newOptions);
        } catch (error) {
            console.error('Ha ocurrido un error al realizar la Petición a API:', error);
        }
    } 

    useEffect(() => {
        if (valueUsuario !== undefined && valueUsuario !== 0) {
            
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

    const handleInputChange = (inputValue) => {
        setInputValue(inputValue);
        if (inputValue.length >= 3) 
            fetchUsuarios(inputValue);

        return inputValue;
    }

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Información del Cliente</h5>
                    <p className="card-text">Complete para continuar con la compra</p>

                    <div className="row">
                        <div className='col-lg-6'>
                            <label>Usuario</label>

                            <Select
                                className="custom-select form-control"
                                classNamePrefix="select"
                                value={valueUsuario}
                                onChange={(option) => setValueUsuario('idUsuario', option.value)}
                                onInputChange={handleInputChange}
                                inputValue={inputValue}
                                name="idUsuario"
                                options={options}
                                placeholder="Escriba 3 caractéres para generar la búsqueda"
                                noOptionsMessage={({ inputValue }) =>
                                inputValue.length > 0
                                    ? "No se encontraron resultados"
                                    : "No hay opciones disponibles"
                                }
                            />
                        </div>

                        <div className='col-lg-6'>
                            <p className="card-text fw-bold">Correo: <span className='fw-normal'>{correoUser}</span></p>
                            <p className="card-text fw-bold">Teléfono: <span className='fw-normal'>{telefonoUser}</span></p>
                            <p className="card-text fw-bold">Dirección: <span className='fw-normal'>{direccionUser}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
