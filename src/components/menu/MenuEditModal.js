import React, { useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import '../../styles/Switch.css';
import { environment } from '../../environment/environment.dev';
import { Switch } from '../ui/switch/Switch';
import { useForm } from 'react-hook-form';
import { Combobox } from "../ui/combobox/Combobox";
import { AuthContext } from '../../auth/authContext';

const endpoint = environment.UrlApiMenu;
const endpointPadre = environment.UrlApiMenuPadre;
const idApp = environment.ID_APP;

const parser = json => 
    json.map(({ nombre, idMenu }) => ({
        label: nombre, value: idMenu }));

export const MenuEditModal = ({show, close, menuEdit, setMenuEdit} ) => {
    const { user, dispatch } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            idMenu: menuEdit.idMenu,
            nombre: menuEdit.nombre,
            padre: menuEdit.padre,
            url: menuEdit.url,
            urlFriend: menuEdit.url,
            esActivo: menuEdit.esActivo,
            esPadre: menuEdit.esPadre,
            tieneHijos: menuEdit.tieneHijos
        }
    });

    useEffect(() => {
        setEsActivo(menuEdit.esActivo);
        setEsPadre(menuEdit.esPadre);
        setTieneHijos(menuEdit.tieneHijos);
        setValuePadre(menuEdit.padre);
        reset(menuEdit);
      }, [menuEdit]);

    const [valuePadre, setValuePadre] = useState();

    const [esActivo, setEsActivo] = useState(false);
    const [esPadre, setEsPadre] = useState(false);
    const [tieneHijos, setTieneHijos] = useState(false);
    
    const onToggleActivo = () => setEsActivo(!esActivo);
    const onTogglePadre = () => setEsPadre(!esPadre);
    const onToggleChild = () => setTieneHijos(!tieneHijos);

    const onSubmit = (data) => {
        let menuSend = {
            IdMenu: data.idMenu,
            IdApp: idApp,
            Nombre: data.nombre,
            Padre: valuePadre,
            Url: data.url,
            UrlFriend: data.url,
            EsActivo: esActivo,
            EsPadre: esPadre,
            TieneHijos: tieneHijos
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
                fetch(endpoint + "?id=" + menuEdit.idMenu, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify(menuSend)
                })
                .then(response => response.json())
                .then(data => {
                    setMenuEdit(menuSend);
                    setTimeout(() => {
                        close(true);
                    Swal.fire('Actualizado!', '', 'success');
                    }, 100);
                    
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
                <form className="container animate__animated animate__fadeIn" onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Nombre</label>
                            <input 
                                type="text" 
                                placeholder="Nombre" 
                                className="form-control" 
                                name="nombre"
                                {...register("nombre")}
                                />
                        </div>

                        <div className="col-lg-6">
                            <label>Url</label>
                            <input 
                                type="text" 
                                placeholder="Url" 
                                className="form-control" 
                                name="url" 
                                {...register("url")}
                                />
                        </div>
                    </div>
                    <br />
                    <div className='row'>
                        <div className="col-lg-6">
                            <label>Padre</label>
                                <Combobox
                                    id={"todos"}
                                    value={valuePadre}
                                    setValue={setValuePadre}
                                    url={endpointPadre}
                                    parser={parser}
                                    tipoAuth={environment.JWTAuthType}
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