import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';
import { Switch } from '../ui/switch/Switch';
import axios from 'axios';
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import { parserLugar } from '../../types/parsers';
import { Loader } from '../ui/loader/Loader';
import { FcAddImage } from "react-icons/fc";
import { ImageLoadAddEdit } from '../ui/imageLoad/ImageLoadAddEdit';

const UrlGetLugares = environment.UrlGetLugares;
const UrlEvento = environment.UrlGetEventos;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    nombreEvento: Yup.string().required('El Nombre es requerido'),
    descripcion: Yup.string().required('La Descripción es requerida'),
    //direccion: Yup.string().required('La Dirección es requerido'),
    fecha: Yup.string().required('La Fecha es obligatoria')
});

export const EventoAddModal = ({show, close}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        formik.resetForm();
    }, [show]);

    const formik = useFormik({
        initialValues: {  
            idLugar: 0,
            nombreEvento: '',
            descripcion: '',
            //direccion: '',
            fecha: '',
            flyer: '',
            contenidoFlyer: '',
            observacion: '',
            productoraResponsable: '',
            banner: false,
            contenidoBanner: '',
            activo: true
          
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let fechaEvento = new Date(values.fecha);
            values.fecha = fechaEvento;
            Swal.fire({
                title: 'Atención',
                text: '¿Desea Agregar el Evento?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(!loading);
                    try {
                        let response = await axios.post(UrlEvento, values, {
                            headers: {
                                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                            },
                        });
    
                        if(response.status === 200) {
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
        },
    });

    const onFileChange = ({target}) => {
        const file = target.files[0];
        if (file) {
            const reader = new FileReader();
            const fileName = file.name.split('.')[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                formik.setFieldValue('flyer', fileName);
                formik.setFieldValue('contenidoFlyer', base64String);
            }
            reader.onerror = (error) => {
                console.log('Error al convertir a Base64:', error);
            }
        }
    }

    return (
        <>
          { loading ? <Loader /> :
            <Modal show={show} onHide={close} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Evento</Modal.Title>
                </Modal.Header>
                <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                    <Modal.Body>

                        <div className='row'>
                            <div className="col-lg-12">
                                <label>Lugar</label>
                                <Combobox
                                    id={"idLugar"}
                                    value={formik.values.idLugar}
                                    setValue={formik.handleChange}
                                    url={UrlGetLugares}
                                    parser={parserLugar}
                                    tipoAuth={environment.BasicAuthType}
                                />
                            </div>
                            
                        </div>
                        <br />
                        <div className='row'>
                            <div className='col-lg-6'>
                                <label>Nombre</label>
                                <input 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="nombreEvento" 
                                    value={formik.values.nombreEvento} 
                                    autoComplete="off"
                                />

                                {formik.touched.nombreEvento && formik.errors.nombreEvento ? (
                                        <div style={{color:'red'}}>{formik.errors.nombreEvento}</div>
                                        ) : null}
                            </div>

                            <div className='col-lg-6'>
                                <label>Descripción</label>
                                <input 
                                    type="text" 
                                    placeholder="Descripción" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="descripcion" 
                                    value={formik.values.descripcion} 
                                    autoComplete="off"
                                />

                                {formik.touched.descripcion && formik.errors.descripcion ? (
                                        <div style={{color:'red'}}>{formik.errors.descripcion}</div>
                                        ) : null}
                            </div>
                        </div>
                        <br/>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <label>Fecha Evento</label>
                                <input 
                                    type="datetime-local" 
                                    placeholder="Fecha Evento" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="fecha" 
                                    defaultValue={formik.values.fecha} 
                                    autoComplete="off"
                                />

                                {formik.touched.fecha && formik.errors.fecha ? (
                                        <div style={{color:'red'}}>{formik.errors.fecha}</div>
                                        ) : null}
                            </div>

                            <div className='col-lg-4'>
                                <label>Productora Responsable</label>
                                <input 
                                    type="text" 
                                    placeholder="Productora Responsable" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="productoraResponsable" 
                                    value={formik.values.productoraResponsable} 
                                    autoComplete="off"
                                />
                            </div>
                            <div className='col-lg-4'>
                                <label>Observación</label>
                                <textarea
                                    placeholder='Observacion'
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="observacion" 
                                    value={formik.values.observacion} 
                                    autoComplete="off"
                                />
                            </div>
                            
                        </div>
                        <br/>
                        <div className='row'>
                            <div className="col-lg-6">
                                <label>Banner</label>
                                <Switch
                                    id="banner"
                                    isOn={formik.values.banner}
                                    onToggle={formik.handleChange}
                                />
                                
                            </div>

                            <div className="col-lg-6">
                                <label>Vigencia</label>
                                <Switch
                                    id="activo"
                                    isOn={formik.values.activo}
                                    onToggle={formik.handleChange}
                                />
                                
                            </div>

                            
                        </div>
                        <br/>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <label>Flyer</label>
                                <input 
                                    type='file'
                                    className='form-control'
                                    onChange={onFileChange}
                                    accept='image/*'
                                    autoComplete='off'
                                    name="contenidoFlyer"
                                    defaultValue={formik.values.contenidoFlyer}
                                />
                                <br/>
                              
                            </div>

                            <div className='col-lg-6'>
                                <label>Contenido Banner</label>
                                <input 
                                    type="text" 
                                    placeholder="Contenido Banner" 
                                    className="form-control" 
                                    onChange={formik.handleChange} 
                                    name="contenidoBanner" 
                                    value={formik.values.contenidoBanner} 
                                    autoComplete="off"
                                />
                            </div>

                           
                            <div className='row'>
                                <div className='col-lg-6'>
                                    { 
                                        formik.values.contenidoFlyer == '' ? 
                                            <div className='' style={{border: '3px dotted', justifyContent: 'center', alignItems: 'center', display: 'flex', height: '50px'} } >
                                                <FcAddImage />
                                            </div>
                                            : <ImageLoadAddEdit image={formik.values.contenidoFlyer} />
                                    }
                                </div>
                            </div>

                        </div>
                    
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary">Aceptar</button>
                        <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
                    </Modal.Footer>
                </form>
                
            </Modal>
            }
        </>
    )
}

