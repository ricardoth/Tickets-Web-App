import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { Loader } from '../ui/loader/Loader';
import { Input } from '../ui/input/Input';
import { Switch } from '../ui/switch/Switch';
import { FcAddImage } from 'react-icons/fc';
import { ImageLoadAddEdit } from '../ui/imageLoad/ImageLoadAddEdit';
import * as Yup from 'yup';
import { basicAuth } from '../../types/basicAuth';
import { environment } from '../../environment/environment.dev';
import {Buffer} from 'buffer';
import axios from "axios";
import Swal from 'sweetalert2';

const URL_MEDIO_PAGO = environment.UrlGetMedioPagos;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    nombreMedioPago: Yup.string().required('El Nombre es requerido'),
    descripcion: Yup.string().required('La Ubicación es requerido'),
});

export const MedioPagoAddModal = ({show, close}) => {
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        formik.resetForm();
    }, [show]);

    const formik = useFormik({
        initialValues: {
            nombreMedioPago: '',
            descripcion: '',
            urlImageBlob: '',
            nombreImageBlob: '',
            activo: true
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            Swal.fire({
                title: 'Atención',
                text: '¿Desea Agregar el Medio de Pago?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(!loading);
                    try {
                        let response = await axios.post(URL_MEDIO_PAGO, values, {
                            headers: {
                                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                            },
                        });
    
                        if(response.status === 201) {
                            setLoading(false);
                            formik.resetForm();
                            close();
                        } else {
                            setLoading(false);
                            Swal.fire('Ha ocurrido un error', 'No se pudo agregar el elemento', 'error');
                        }
                    } catch (error) {
                        setLoading(false);
                        const {response} = error;
                        Swal.fire('Ha ocurrido un error', response.data, 'error');
                    }
                    
                }
            });
        }
    });

    const onFileChange = ({target}) => {
        const file = target.files[0];
        if (file) {
            const reader = new FileReader();
            const fileName = file.name.split('.')[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                formik.setFieldValue('urlImageBlob', base64String);
                formik.setFieldValue('nombreImageBlob', fileName);
            }
            reader.onerror = (error) => {
                console.log('Error al convertir a Base64:', error);
            }
        }
    }

    return (
        <Modal
            show={show}
            onHide={close}
        >
            <Modal.Header closeButton>
                <Modal.Title>Agregar Medio de Pago</Modal.Title>
            </Modal.Header>

            <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                <Modal.Body>
                    <div className="row">
                        <div className='col-lg-6'>
                            <label>Nombre</label>
                            <Input 
                                type="text"
                                placeholder="Nombre"
                                className="form-control"
                                name="nombreMedioPago"
                                value={formik.values.nombreMedioPago}
                                handleChange={formik.handleChange}
                            />
                            {formik.touched.nombreMedioPago && formik.errors.nombreMedioPago ? (
                                    <div style={{color:'red'}}>{formik.errors.nombreMedioPago}</div>
                                    ) : null}
                        </div>

                        <div className='col-lg-6'>
                            <label>Descripción</label>
                            <Input 
                                type="text"
                                placeholder="Descripción"
                                className="form-control"
                                name="descripcion"
                                value={formik.values.descripcion}
                                handleChange={formik.handleChange}
                            />
                            {formik.touched.descripcion && formik.errors.descripcion ? (
                                    <div style={{color:'red'}}>{formik.errors.descripcion}</div>
                                    ) : null}
                        </div>
                    </div>
                    <br/>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <label>Banner</label>
                            <input 
                                type='file'
                                className='form-control'
                                onChange={onFileChange}
                                accept='image/*'
                                autoComplete='off'
                                name="urlImageBlob"
                                defaultValue={formik.values.urlImageBlob}
                            />
                            <br/>
                        </div>

                        
                        <div className="col-lg-6">
                            <label>Vigencia</label>
                            <Switch
                                id="activo"
                                isOn={formik.values.activo}
                                onToggle={formik.handleChange}
                            />
                        </div>

                        <div className='row'>
                            <div className='col-lg-6'>
                                { 
                                    formik.values.urlImageBlob == '' ? 
                                        <div className='' style={{border: '3px dotted', justifyContent: 'center', alignItems: 'center', display: 'flex', height: '50px'} } >
                                            <FcAddImage />
                                        </div>
                                        : 
                                        <ImageLoadAddEdit image={formik.values.urlImageBlob} />     
                                }
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    {
                        loading ? <Loader /> : <>
                            <button type="submit" className="btn btn-primary">Aceptar</button>
                            <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
                        </>
                    }
                </Modal.Footer>
            </form>
        </Modal>
    )
}
