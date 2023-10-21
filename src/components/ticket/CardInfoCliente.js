import React, { useContext, useEffect, useState } from 'react'
import { environment } from '../../environment/environment.dev';
import { basicAuth} from '../../types/basicAuth';
import {Buffer} from 'buffer';
import axios from 'axios';
import Select from 'react-select';
import { TicketContext } from '../../context/ticketContext';
import { types } from '../../types/types';
import Swal from 'sweetalert2';
import { AuthContext } from '../../auth/authContext';

const UrlGetUsuarioTicket = environment.UrlGetUsuario;
const UrlGetUsuariosFilter = environment.UrlGetUsuariosFilter;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const CardInfoCliente = () => {
    const { dispatch } = useContext(AuthContext);
    const { ticketState, ticketDispatch } = useContext(TicketContext);
    
    const [correoUser, setCorreoUser] = useState("");
    const [telefonoUser, setTelefonoUser] = useState("");
    const [direccionUser, setDireccionUser] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if(ticketState.formValues.idUsuario <= 0) {
            setCorreoUser("");
            setTelefonoUser("");
            setDireccionUser("");
            setInputValue("");
            setOptions([]);
        } 
    }, [ticketState.formValues.idUsuario]);

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
            Swal.fire('Ha ocurrido un error al realizar la petición a la API', `No se pudieron cargar los datos: ${error}`, 'error');

            setTimeout(() => {
                dispatch({ type: types.logout });
            }, 1000)
        }
    } 

    const handleInputChange = (inputValue) => {
        setInputValue(inputValue);
        if (inputValue.length >= 3) 
            fetchUsuarios(inputValue);

        return inputValue;
    }

    const onChangeValue = (optionValue) => {
        if(optionValue > 0) {
            axios.get(UrlGetUsuarioTicket + `${optionValue}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            })
            .then(response => {
                let {data} = response.data;
                let { idUsuario, correo, telefono, direccion} = data;
                ticketDispatch({type: types.updateIdUsuarioValue, payload: idUsuario});
                setCorreoUser(correo);
                setTelefonoUser(telefono);
                setDireccionUser(direccion);
            })
            .catch(err => {
                console.error("Ha ocurrido un error al realizar la Petición a API", err);
                Swal.fire('Ha ocurrido un error al realizar la petición a la API', `No se pudieron cargar los datos: ${err}`, 'error');

                setTimeout(() => {
                    dispatch({ type: types.logout });
                }, 1000)
            });
        } else {
            console.log("Debe seleccionar un elemento");
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Información del Cliente</h5>
                    {/* <p className="card-text">Complete para continuar con la compra</p> */}

                    <div className="row">
                        <div className='col-lg-6'>
                            <label>Usuario</label>
                            <Select
                                className="custom-select form-control"
                                classNamePrefix="select"
                                value={ticketState.formValues.idUsuario}
                                onChange={(option) => onChangeValue(option.value)}
                                onInputChange={handleInputChange}
                                inputValue={inputValue}
                                name="idUsuario"
                                options={options}
                                placeholder="Escriba 3 caractéres para generar la búsqueda"
                                noOptionsMessage={({ inputValue }) =>   inputValue.length > 0
                                                                        ? "No se encontraron resultados"
                                                                        : "No hay opciones disponibles" }
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