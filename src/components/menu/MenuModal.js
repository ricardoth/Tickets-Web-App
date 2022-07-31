import React, { useEffect, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import { environment } from '../../environment/environment.dev';

const endpoint = environment.UrlApiMenu + "?id=";
const idApp = environment.ID_APP;

export const MenuModal = ({show, close, menuEdit, setMenuEdit} ) => {
    const [ formValues, handleInputChange, reset ] = useForm(menuEdit);
    console.log(formValues)

    useEffect(() => {
        // console.log(menuEdit)
        //No cambia el estado anterior en el form
        reset();
    }, [menuEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();

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
                    setMenuEdit(formValues);
                    // console.log(menuEdit)
                    // const temp = [...menus];
                    // const index = temp.findIndex(x => x.idMenu === idMenu);
                    // temp.splice(index, 1);
                    // setMenus(temp);
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
                                defaultValue={formValues.nombre} 
                                
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
                                defaultValue={formValues.url}
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
                                defaultValue={formValues.padre}
                                />
                        </div>

                        <div className="col-lg-6">
                            <label>Vigencia</label>
                            <input 
                                type="text" 
                                placeholder="Vigencia" 
                                className="form-control" 
                                onChange={handleInputChange} 
                                name="esActivo" 
                                defaultValue={formValues.esActivo}
                                />
                        </div>
                    </div>

                    <br />
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Indicador Padre</label>
                            <input 
                                type="text" 
                                placeholder="Indicador Padre" 
                                className="form-control" 
                                onChange={handleInputChange} 
                                name="esPadre" 
                                defaultValue={formValues.esPadre}
                                />
                        </div>

                        <div className="col-lg-6">
                            <label>Indicador Submenús</label>
                            <input 
                                type="text" 
                                placeholder="Indicador Submenús" 
                                className="form-control" 
                                onChange={handleInputChange} 
                                name="tieneHijos" 
                                defaultValue={formValues.tieneHijos}
                                />
                        </div>
                    </div>
                    <br />
                    <div className='modal-footer'>
                        <button type="submit" className="btn btn-primary" >Aceptar</button>
                        <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
                    </div>
                </form>
                </Modal.Body>
              
            </Modal>
        </>
    );
}