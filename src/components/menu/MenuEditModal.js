import React, { useEffect, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import '../../styles/Switch.css';

import { environment } from '../../environment/environment.dev';
import { Switch } from '../switch/Switch';

const endpoint = environment.UrlApiMenu + "?id=";
const idApp = environment.ID_APP;

export const MenuEditModal = ({show, close, menuEdit, setMenuEdit} ) => {
    const [ formValues, handleInputChange, reset ] = useForm(menuEdit);

    const [esActivo, setEsActivo] = useState(false);
    const [esPadre, setEsPadre] = useState(false);
    const [tieneHijos, setTieneHijos] = useState(false);

    // const onToggle = (id) => {
    //     // setEsActivo(!esActivo);
    //     // setEsPadre(!esPadre);
    //     // setTieneHijos(!tieneHijos);
    //     setEsActivo((preState) => ({
    //         ...preState,
    //         [id]: !preState[id]
    //     }));
    //     setEsPadre((preState) => ({
    //         ...preState,
    //         [id]: !preState[id]
    //     }));
    //     setTieneHijos((preState) => ({
    //         ...preState,
    //         [id]: !preState[id]
    //     }));
    // }
    const onToggleActivo = () => setEsActivo(!esActivo);
    const onTogglePadre = () => setEsPadre(!esPadre);
    const onToggleChild = () => setTieneHijos(!tieneHijos);

    useEffect(() => {
        // if(!Object.entries(menuEdit).length === 0) {
        //     console.log(menuEdit)
           
        //     // setEsActivo(menuEdit.esActivo);
        // }
        reset();
    }, [menuEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = new FormData(e.target);
        let formObject = Object.fromEntries(data.entries());

        let menuSend = {
            IdMenu: formValues.idMenu,
            IdApp: idApp,
            Nombre: formValues.nombre,
            Padre: formValues.padre,
            Url: formValues.url,
            UrlFriend: formValues.url,
            EsActivo: formValues.esActivo,
            EsPadre: formValues.esPadre,
            TieneHijos: formValues.tieneHijos
        }

        console.log(esActivo)
        Swal.fire({
            title: 'Atención',
            text: '¿Desea editar el menú?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(endpoint + menuEdit.idMenu, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(menuSend)
                })
                .then(response => response.json())
                .then(data => {
                    setMenuEdit(formObject);
                    close(true);
                    Swal.fire('Actualizado!', '', 'success');
                })
                .catch(err => console.log(err)); 
              }
        });
    }

    return (
        <>
            <Modal 
                show={show} 
                onHide={close}
            >
                <Modal.Header closeButton>
                <Modal.Title>Editar Menú</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form className="container animate__animated animate__fadeIn" onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Nombre</label>
                            <input 
                                type="text" 
                                placeholder="Nombre" 
                                className="form-control" 
                                onChange={handleInputChange} 
                                name="nombre"
                                defaultValue={menuEdit.nombre} 
                                
                                />
                        </div>

                        <div className="col-lg-6">
                            <label>Url</label>
                            <input 
                                type="text" 
                                placeholder="Url" 
                                className="form-control" 
                                onChange={handleInputChange} 
                                name="url" 
                                defaultValue={menuEdit.url}
                                />
                        </div>
                    </div>
                    <br />
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Padre</label>
                            <input 
                                type="text" 
                                placeholder="Padre" 
                                className="form-control" 
                                onChange={handleInputChange} 
                                name="padre" 
                                defaultValue={menuEdit.padre}
                                />
                        </div>

                        <div className="col-lg-6">
                            <label>Vigencia</label>
                            <div>
                                <label className="toggle-switch">
                                    <Switch
                                        id="1"
                                        isOn={esActivo}
                                        onToggle={onToggleActivo}
                                    />

                                </label>
                            </div>
                        </div>
                    </div>

                    <br />
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Indicador Padre</label>
                            <div>
                                <label className="toggle-switch">
                                    <Switch
                                        id="2"
                                        isOn={esPadre}
                                        onToggle={onTogglePadre}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <label>Indicador Submenús</label>
                            <div>
                                <label className="toggle-switch">
                                     <Switch
                                        id="3"
                                        isOn={tieneHijos}
                                        onToggle={onToggleChild}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='modal-footer'>
                        <button type="submit" className="btn btn-primary">Aceptar</button>
                        <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
                    </div>
                </form>
                </Modal.Body>
            </Modal>
        </>
    );
}