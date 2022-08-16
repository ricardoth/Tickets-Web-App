import React, { useEffect, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Dropdown, Row, Modal} from  'react-bootstrap';
import Swal from 'sweetalert2';
import { environment } from '../../environment/environment.dev';
import '../../styles/Switch.css';
import { Switch } from '../ui/switch/Switch';
import { Combobox } from "../ui/combobox/Combobox";

const endpoint = environment.UrlApiMenu;
const endpointPadre = environment.UrlApiMenuPadre;
const idApp = environment.ID_APP;

const parser = json => 
    json.map(({ nombre, idMenu }) => ({
        label: nombre, value: idMenu }));


export const MenuAddModal = ({show, close, setMenus}) => {
    const [ formValues, handleInputChange, reset ] = useForm({
        idMenu: 0,
        nombre: '',
        padre: 0,
        url: '',
        urlFriend: '',
        esActivo: false,
        esPadre: false,
        tieneHijos: false
    });

    useEffect(() => {
        reset();
        setEsActivo(false);
        setEsPadre(false);
        setTieneHijos(false);
        setValuePadre(0);
    }, [show, close])
    

    const [esActivo, setEsActivo] = useState(false);
    const [esPadre, setEsPadre] = useState(false);
    const [tieneHijos, setTieneHijos] = useState(false);

    const [valuePadre, setValuePadre] = useState();

    const onToggleActivo = () => setEsActivo(!esActivo);
    const onTogglePadre = () => setEsPadre(!esPadre);
    const onToogleChild = () => setTieneHijos(!tieneHijos);

    const handleSubmit = (e) => {
        e.preventDefault();

        let menuSend = {
            IdApp: idApp,
            Nombre: formValues.nombre,
            Padre: valuePadre,
            Url: formValues.url,
            UrlFriend: formValues.url,
            EsActivo: esActivo,
            EsPadre: esPadre,
            TieneHijos: tieneHijos
        }

        Swal.fire({
            title: 'Atención',
            text: '¿Desea agregar el menú?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(endpoint , {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(menuSend)
                })
                .then(response => response.json())
                .then(data => {
                    if(!data.ok ){
                        setMenus(endpoint);
                        close(true);
                        Swal.fire('Agregado!', '', 'success');
                    } else {
                        console.log(data)
                    }
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
                    <Modal.Title>Agregar Menú</Modal.Title>
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
                                    autoComplete="off"
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
                                    autoComplete="off"
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
                                    // defaultValue={formValues.padre} 
                                    setValue={setValuePadre}
                                    url={endpointPadre}
                                    parser={parser}
                                />
                                {/* <input 
                                    type="number" 
                                    placeholder="Padre" 
                                    className="form-control" 
                                    onChange={handleInputChange} 
                                    name="padre" 
                                    defaultValue={formValues.padre} 
                                    autoComplete="off"
                                    /> */}
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
                                            onToggle={onToogleChild}
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
    )
}
