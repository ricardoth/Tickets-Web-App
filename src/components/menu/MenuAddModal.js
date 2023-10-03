import React, { useContext, useEffect } from 'react';
import { Modal} from  'react-bootstrap';
import Swal from 'sweetalert2';
import { environment } from '../../environment/environment.dev';
import '../../styles/Switch.css';
import { Switch } from '../ui/switch/Switch';
import { Combobox } from "../ui/combobox/Combobox";
import { AuthContext } from '../../auth/authContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El Nombre es requerido'),
    url: Yup.string().required('El URL es requerido'),
});


const endpoint = environment.UrlApiMenu;
const endpointPadre = environment.UrlApiMenuPadre;
const idApp = environment.ID_APP;

const parser = json => 
    json.map(({ nombre, idMenu }) => ({
        label: nombre, value: idMenu }));


export const MenuAddModal = ({show, close, setMenus}) => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        formik.resetForm();
    }, [show])

    const formik = useFormik({
        initialValues: {
            idMenu: 0,
            nombre: '',
            url: '',
            padre: '',
            esActivo: false,
            esPadre: false,
            tieneHijos: false,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            values.urlFriend = values.url;

            let menuSend = {
                IdMenu: values.idMenu,
                IdApp: idApp,
                Nombre: values.nombre,
                Padre: values.padre,
                Url: values.url,
                UrlFriend: values.url,
                EsActivo: values.esActivo,
                EsPadre: values.esPadre,
                TieneHijos: values.tieneHijos
            }

            Swal.fire({
                title: 'Atención',
                text: '¿Desea Agregar el menú?',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    
                    fetch(endpoint , {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        },
                        body: JSON.stringify(menuSend)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(!data.ok ){
                            setMenus(1);
                            close(true);
                            formik.resetForm();
                            Swal.fire('Agregado!', '', 'success');
                        } else {
                            console.log(data)
                        }
                    })
                    .catch(err => console.log(err)); 
    
                }
            });
        },
    });

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
                    <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                        <div className='row'>
                            <div className="col-lg-6">
                                <label>Nombre</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="nombre"
                                    defaultValue={formik.values.nombre} 
                                    autoComplete="off"
                                    />

                                {formik.touched.nombre && formik.errors.nombre ? (
                                        <div style={{color:'red'}}>{formik.errors.nombre}</div>
                                        ) : null}
                            </div>
  
                            <div className="col-lg-6">
                                <label>Url</label>
                                <input 
                                    type="text" 
                                    placeholder="Url" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="url" 
                                    defaultValue={formik.values.url} 
                                    autoComplete="off"
                                    />

                                {formik.touched.url && formik.errors.url ? (
                                        <div style={{color:'red'}}>{formik.errors.url}</div>
                                        ) : null}
                            </div>
                            
                            </div> 
                            <br />
                            <div className='row'>
                                <div className="col-lg-6">
                                    <label>Padre</label>
                                    <Combobox
                                        id={"padre"}
                                        value={formik.values.padre}
                                        setValue={formik.handleChange}
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
                                                id="esActivo"
                                                isOn={formik.values.esActivo}
                                                onToggle={formik.handleChange}
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
                                                id="esPadre"
                                                isOn={formik.values.esPadre}
                                                onToggle={formik.handleChange}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <label>Indicador Submenús</label>
                                    <div>
                                        <label className="toggle-switch">
                                            <Switch
                                                id="tieneHijos"
                                                isOn={formik.values.tieneHijos}
                                                onToggle={formik.handleChange}
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
