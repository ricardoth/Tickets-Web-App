import { useFormik } from 'formik';
import { Modal } from 'react-bootstrap';
import { Combobox } from '../ui/combobox/Combobox';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/basicAuth';
import { parserTipoUsuario } from '../../types/parsers';
import { Switch } from '../ui/switch/Switch';
import { validarRutChileno } from '../../selectors/validarChileanRut';
import { Buffer } from 'buffer';

import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useState } from 'react';
import { Loader } from '../ui/loader/Loader';

const UrlGetTiposUsuarios = environment.UrlGetTiposUsuarios;
const UrlUsuario = environment.UrlGetUsuarios;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    rutDv: Yup.string().test(
        'Rut Válido', 
        'El Rut no es válido',
        value => validarRutChileno(value)),
    nombres: Yup.string().required('El Nombre es requerido'),
    apellidoP: Yup.string().required('El Apellido Paterno es requerido'),
    apellidoM: Yup.string().required('El Apellido Materno es requerido'),
    direccion: Yup.string().required('La Dirección es requerido'),
    correo: Yup.string().required('El Correo es requerido'),
    telefono: Yup.string().required('El Teléfono es requerido'),
});

export const UsuarioEditModal = ({show, close, userEdit}) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            idUsuario: userEdit.idUsuario,
            idTipoUsuario: userEdit.idTipoUsuario,
            rutDv: userEdit.rut + '-' + userEdit.dv,
            nombres: userEdit.nombres,
            apellidoP: userEdit.apellidoP,
            apellidoM: userEdit.apellidoM,
            direccion: userEdit.direccion,
            correo: userEdit.correo,
            telefono: userEdit.telefono,
            activo: userEdit.activo
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let rutSplit = values.rutDv.split('-');
            let rut = rutSplit[0];
            let dv = rutSplit[1];

            let userValues = {
                idUsuario: values.idUsuario,
                idTipoUsuario: values.idTipoUsuario,
                rut: rut,
                dv: dv,
                nombres: values.nombres,
                apellidoP: values.apellidoP,
                apellidoM: values.apellidoM,
                direccion: values.direccion,
                correo: values.correo,
                telefono: values.telefono,
                activo: values.activo
            }

            Swal.fire({
                title: 'Atención',
                text: '¿Desea Editar el Usuario?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(!loading);
                    await axios.put(`${UrlUsuario}?id=${values.idUsuario}`, userValues, {
                        headers: {
                            Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                        },
                    }).then(response => {
                        if(response.status === 200) {
                            setLoading(false);
                            formik.resetForm();
                            close();
                            Swal.fire('Información', 'Se ha actualizado el usuario correctamente', 'success');
                        } else {
                            setLoading(false);
                            Swal.fire('Ha ocurrido un error', 'No se pudo agregar el elemento', 'error');
                        }
                    }).catch(err => {
                        const {response} = err;
                        const mensajesArray = response.data.map(x => x.errorMessage);
                        Swal.fire('Ha ocurrido un error', mensajesArray.toString(), 'error');
                        setLoading(false);
                    });
                    
                }
            });
        }
    })

    return (
        <>
            <Modal
                show={show}
                onHide={close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>

                <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-lg-6">
                                <label>TipoUsuario</label>
                                <Combobox
                                    id={"idTipoUsuario"}
                                    value={formik.values.idTipoUsuario}
                                    setValue={formik.handleChange}
                                    url={UrlGetTiposUsuarios}
                                    parser={parserTipoUsuario}
                                    tipoAuth={environment.BasicAuthType}
                                />
                            </div>
                            <div className='col-lg-6'>
                                <label>Rut</label>
                                <input 
                                    type="text" 
                                    placeholder="Rut" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    onBlur={formik.handleBlur}
                                    name="rutDv" 
                                    value={formik.values.rutDv} 
                                    autoComplete="off"
                                    maxLength={10}
                                />

                                {formik.touched.rutDv && formik.errors.rutDv ? (
                                        <div style={{color:'red'}}>{formik.errors.rutDv}</div>
                                        ) : null}
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-lg-6">
                                <label>Nombre</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="nombres" 
                                    value={formik.values.nombres} 
                                    autoComplete="off"
                                />

                                {formik.touched.nombres && formik.errors.nombres ? (
                                        <div style={{color:'red'}}>{formik.errors.nombres}</div>
                                        ) : null}
                            </div>
                            <div className='col-lg-6'>
                                <label>Apellido Paterno</label>
                                <input 
                                    type="text" 
                                    placeholder="Apellido Paterno" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="apellidoP" 
                                    value={formik.values.apellidoP} 
                                    autoComplete="off"
                                />

                                {formik.touched.apellidoP && formik.errors.apellidoP ? (
                                        <div style={{color:'red'}}>{formik.errors.apellidoP}</div>
                                        ) : null}
                            </div>
                            
                        </div>
                        <br/>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <label>Apellido Materno</label>
                                <input 
                                    type="text" 
                                    placeholder="Apellido Materno" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="apellidoM" 
                                    value={formik.values.apellidoM} 
                                    autoComplete="off"
                                />

                                {formik.touched.apellidoM && formik.errors.apellidoM ? (
                                        <div style={{color:'red'}}>{formik.errors.apellidoM}</div>
                                        ) : null}
                            </div>
                            <div className='col-lg-6'>
                                <label>Dirección</label>
                                <input 
                                    type="text" 
                                    placeholder="Dirección" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="direccion" 
                                    value={formik.values.direccion} 
                                    autoComplete="off"
                                />

                                {formik.touched.direccion && formik.errors.direccion ? (
                                        <div style={{color:'red'}}>{formik.errors.direccion}</div>
                                        ) : null}
                            </div>
                            
                        </div>
                        <br/>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <label>Correo</label>
                                <input 
                                    type="email" 
                                    placeholder="Correo" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="correo" 
                                    value={formik.values.correo} 
                                    autoComplete="off"
                                />

                                {formik.touched.correo && formik.errors.correo ? (
                                        <div style={{color:'red'}}>{formik.errors.correo}</div>
                                        ) : null}
                            </div>
                            <div className='col-lg-4'>
                                <label>Teléfono</label>
                                <input 
                                    type="text" 
                                    placeholder="Teléfono" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="telefono" 
                                    value={formik.values.telefono} 
                                    autoComplete="off"
                                />

                                {formik.touched.telefono && formik.errors.telefono ? (
                                        <div style={{color:'red'}}>{formik.errors.telefono}</div>
                                        ) : null}
                            </div>

                            <div className="col-lg-4">
                                <label>Vigencia</label>
                                <Switch
                                    id="activo"
                                    isOn={formik.values.activo}
                                    onToggle={formik.handleChange}
                                />
                            </div>
                        </div>


                    </Modal.Body>


                    
                    {
                        loading ? <Loader /> : (
                            <Modal.Footer>
                                <button type="submit" className="btn btn-primary">Aceptar</button>
                                <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
                            </Modal.Footer>
                        )
                        
                    }
                        
                    
                </form>
                
            </Modal>
        </>
    )
}
