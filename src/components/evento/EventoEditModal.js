import { useFormik } from 'formik'
import { Modal } from 'react-bootstrap'
import { basicAuth } from '../../types/basicAuth';
import * as Yup from 'yup';
import { Combobox } from '../ui/combobox/Combobox';
import { environment } from '../../environment/environment.dev';
import { parserLugar } from '../../types/parsers';
import { Switch } from '../ui/switch/Switch';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FcAddImage } from 'react-icons/fc';
import { Loader } from '../ui/loader/Loader';
import { formatDateHourEventTicket } from '../../types/formatDate';
import { ImageLoadAddEdit } from '../ui/imageLoad/ImageLoadAddEdit';

const UrlGetLugares = environment.UrlGetLugares;
const UrlPutEvento = environment.UrlGetEventos;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    nombreEvento: Yup.string().required('El Nombre es requerido'),
    descripcion: Yup.string().required('La Descripción es requerida'),
    direccion: Yup.string().required('La Dirección es requerido'),
    fecha: Yup.string().required('La Fecha es obligatoria')
});

export const EventoEditModal = ({show, close, eventoEdit}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        formik.setFieldValue('fecha', formatDateHourEventTicket(eventoEdit.fecha));
        formik.setFieldValue('contenidoFlyer', eventoEdit.contenidoFlyer);
    }, [eventoEdit]);
    
    const formik = useFormik({
        initialValues: {
            idEvento: eventoEdit.idEvento,
            idLugar: eventoEdit.idLugar,
            nombreEvento: eventoEdit.nombreEvento,
            descripcion: eventoEdit.descripcion,
            direccion: eventoEdit.direccion,
            fecha: '',
            flyer: eventoEdit.flyer,
            contenidoFlyer: '',
            observacion: eventoEdit.observacion,
            productoraResponsable: eventoEdit.productoraResponsable,
            activo: eventoEdit.activo
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let fechaEvento = new Date(values.fecha);
            values.fecha = fechaEvento;
            Swal.fire({
                title: 'Atención',
                text: '¿Desea Editar el Evento?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result)=> {
                if (result.isConfirmed) { 
                    setLoading(!loading);
                    try {
                        let response = await axios.put(`${UrlPutEvento}?id=${values.idEvento}`, values, {
                            headers: {
                                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                            }
                        });
    
                        if(response.status === 200) {
                            setLoading(false);
                            formik.resetForm();
                            close();
                            Swal.fire('Información', 'Se ha actualizado el evento correctamente', 'success');
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
            })

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
                <Modal
                    show={show}
                    onHide={close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Evento</Modal.Title>
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
                                <br/>
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


                                    <div className='col-lg-6'>
                                        <label>Fecha Evento</label>
                                        <input 
                                            type="datetime-local" 
                                            placeholder="Fecha Evento" 
                                            className="form-control" 
                                            onChange={formik.handleChange} 
                                            name="fecha" 
                                            value={formik.values.fecha} 
                                            autoComplete="off"
                                        />

                                        {formik.touched.fecha && formik.errors.fecha ? (
                                                <div style={{color:'red'}}>{formik.errors.fecha}</div>
                                                ) : null}
                                    </div>
                                </div>
                                <br/>

                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <label>Observación</label>
                                        <input 
                                            type="text" 
                                            placeholder="Observación" 
                                            className="form-control" 
                                            onChange={formik.handleChange} 
                                            name="observacion" 
                                            value={formik.values.observacion} 
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className='col-lg-6'>
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

                                    <div className="col-lg-6">
                                        <label>Vigencia</label>
                                        <Switch
                                            id="activo"
                                            isOn={formik.values.activo}
                                            onToggle={formik.handleChange}
                                        />
                                        
                                    </div>

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
