import { useEffect, useState } from "react";
import { useFormik } from "formik"
import { Modal } from "react-bootstrap"
import { Combobox } from "../ui/combobox/Combobox";
import { environment } from "../../environment/environment.dev";
import { parserRegion } from "../../types/parsers";
import axios from "axios";
import {Buffer} from 'buffer';
import { basicAuth } from "../../types/basicAuth";
import { Input } from "../ui/input/Input";
import { Switch } from "../ui/switch/Switch";
import * as Yup from 'yup';
import Swal from "sweetalert2";
import { Loader } from "../ui/loader/Loader";
import { FcAddImage } from "react-icons/fc";
import { ImageLoadAddEdit } from "../ui/imageLoad/ImageLoadAddEdit";

const UrlGetRegiones = environment.UrlGetRegiones;
const UrlGetComunasByRegion = environment.UrlGetComunasByRegion;
const UrlLugar = environment.UrlGetLugares;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    nombreLugar: Yup.string().required('El Nombre es requerido'),
    ubicacion: Yup.string().required('La Ubicación es requerido'),
    numeracion: Yup.string().required('La Numeración es requerido'),
});

export const LugarAddModal = ({show, close}) => {
    const [ comunas, setComunas] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ imagePreview, setImagePreview ] = useState('');
    const [ referencialMap, setReferencialMap ] = useState('');

    const fetchComunasByRegion = async (paramRegion) => {
        try {
            setLoading(true);
            let response = await axios.get(UrlGetComunasByRegion + `/${paramRegion}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });

            if (response.status === 200) {
                const { data } = response.data;
                setComunas(data);
            } 
            setLoading(false);
        } catch (error) {
            setLoading(false);
            const {response} = error;
            Swal.fire('Ha ocurrido un error', response.data, 'error');
        }
    }

    const formik = useFormik({
        initialValues: {
            idRegion: 0,
            idComuna: 0,
            nombreLugar: "",
            ubicacion: "",
            numeracion: "",
            mapaReferencial: '',
            base64ImagenMapaReferencial: '',
            activo: true
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const objLugar = {
                idComuna: values.idComuna,
                nombreLugar: values.nombreLugar,
                ubicacion: values.ubicacion,
                numeracion: values.numeracion,
                mapaReferencial: referencialMap,
                base64ImagenMapaReferencial: imagePreview,
                activo: values.activo
            }

            Swal.fire({
                title: 'Atención',
                text: '¿Desea Agregar el Lugar?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    let response = await axios.post(UrlLugar, objLugar, {
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
                }
            });
        } 
    });

    useEffect(() => {
        formik.resetForm();
        setImagePreview('');
        setReferencialMap('');
    }, [show]);

    const handleChangeRegion = async ({target}) => {
        formik.setFieldValue('idRegion', target.value);
        if(target.value > 0) {
            await fetchComunasByRegion(target.value);
        } else {
            setComunas([]);
        }
    }

    const onFileChange = ({target}) => {
        const file = target.files[0];
        if (file) {
            const reader = new FileReader();
            const fileName = file.name.split('.')[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                setImagePreview(base64String);
                setReferencialMap(fileName);
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
                <Modal.Title>Agregar Lugar</Modal.Title>
            </Modal.Header>


            <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-6">
                            <label>Región</label>
                            <Combobox
                                id={"idRegion"}
                                value={formik.values.idRegion}
                                setValue={handleChangeRegion}
                                url={UrlGetRegiones}
                                parser={parserRegion}
                                tipoAuth={environment.BasicAuthType}
                            />
                        </div>
                        <div className='col-lg-6'>
                            <label>Comuna</label>
                            <select id="idComuna" value={formik.values.idComuna} onChange={formik.handleChange} className='custom-select form-control'>
                                <option key={0} value={0}>---Seleccione---</option>
                                {  comunas.map((row) => (
                                    <option key={row.idComuna} value={row.idComuna}>{row.nombreComuna}</option>
                                )) }
                                
                            </select>
                            {formik.touched.idComuna && formik.errors.idComuna ? (
                                    <div style={{color:'red'}}>{formik.errors.idComuna}</div>
                                    ) : null}
                        </div>
                    </div>
                    <br/>

                    <div className="row">
                        <div className="col-lg-12">
                            <label>Nombre</label>
                            <Input 
                                type="text"
                                placeholder="Nombre"
                                className="form-control"
                                name="nombreLugar"
                                value={formik.values.nombreLugar}
                                handleChange={formik.handleChange}
                            />
                            {formik.touched.nombreLugar && formik.errors.nombreLugar ? (
                                    <div style={{color:'red'}}>{formik.errors.nombreLugar}</div>
                                    ) : null}
                        </div>     

                        
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-lg-6">
                            <label>Ubicación</label>
                            <Input 
                                type="text"
                                placeholder="Ubicación"
                                className="form-control"
                                name="ubicacion"
                                value={formik.values.ubicacion}
                                handleChange={formik.handleChange}
                            />

                            {formik.touched.ubicacion && formik.errors.ubicacion ? (
                                    <div style={{color:'red'}}>{formik.errors.ubicacion}</div>
                                    ) : null}
                        </div>     

                        <div className="col-lg-6">
                            <label>Numeración</label>
                            <Input 
                                type="text"
                                placeholder="Numeración"
                                className="form-control"
                                name="numeracion"
                                value={formik.values.numeracion}
                                handleChange={formik.handleChange}
                            /> 
                            {formik.touched.numeracion && formik.errors.numeracion ? (
                                    <div style={{color:'red'}}>{formik.errors.numeracion}</div>
                                    ) : null}
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className='col-lg-6'>
                            <label>Mapa Referencial</label>
                            <input 
                                type='file'
                                className='form-control'
                                onChange={onFileChange}
                                accept='image/*'
                                autoComplete='off'
                                name="mapaReferencial"
                                defaultValue={formik.values.mapaReferencial}
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
                                    imagePreview == '' ? 
                                        <div className='' style={{border: '3px dotted', justifyContent: 'center', alignItems: 'center', display: 'flex', height: '50px'} } >
                                            <FcAddImage />
                                        </div>
                                        : 
                                        <ImageLoadAddEdit image={imagePreview} />     
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
