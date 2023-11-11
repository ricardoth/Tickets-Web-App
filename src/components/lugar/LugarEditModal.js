import { useFormik } from "formik";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { Input } from "../ui/input/Input";
import { Switch } from "../ui/switch/Switch";
import { useEffect, useState } from "react";
import { Loader } from "../ui/loader/Loader";
import { environment } from "../../environment/environment.dev";
import { basicAuth } from "../../types/basicAuth";
import {Buffer} from 'buffer';
import axios from "axios";
import { parserRegion } from "../../types/parsers";
import { Combobox } from "../ui/combobox/Combobox";

const UrlGetRegiones = environment.UrlGetRegiones;
const UrlGetComunasByRegion = environment.UrlGetComunasByRegion;
const UrlEditLugar = environment.UrlGetLugares; 

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const LugarEditModal = ({show, close, lugarEdit}) => {
    const [ comunas, setComunas] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        fetchComunasByRegion(lugarEdit.comuna.idRegion);
        formik.setFieldValue('idComuna', lugarEdit.idComuna);
    }, [show, close]);


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
            idRegion: lugarEdit.comuna.idRegion,
            idComuna: lugarEdit.idComuna,
            nombreLugar: lugarEdit.nombreLugar,
            ubicacion: lugarEdit.ubicacion,
            numeracion: lugarEdit.numeracion,
            activo: lugarEdit.activo
        },
        // validationSchema: validationSchema,
        onSubmit: async (values) => {
            
            const objLugar = {
                idComuna: values.idComuna,
                nombreLugar: values.nombreLugar,
                ubicacion: values.ubicacion,
                numeracion: values.numeracion,
                activo: values.activo
            }
            Swal.fire({
                title: 'Atención',
                text: '¿Desea Editar el Lugar?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // setLoading(!loading);
                    // let response = await axios.post(UrlPutLugar, objLugar, {
                    //     headers: {
                    //         Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                    //     },
                    // });

                    // if(response.status === 200) {
                    //     setLoading(false);
                    //     formik.resetForm();
                    //     close();
                    // } else {
                    //     setLoading(false);
                    //     Swal.fire('Ha ocurrido un error', 'No se pudo agregar el elemento', 'error');
                    // }
                }
            });
        } 
    });

    const handleChangeRegion = async ({target}) => {
        formik.setFieldValue('idRegion', target.value);
        if(target.value > 0) {
            await fetchComunasByRegion(target.value);
        } else {
            setComunas([]);
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
                        <div className="col-lg-6">
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
                    </div>
                    <br />

                    <div className="row">
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

                        <div className="col-lg-6">
                            <label>Vigencia</label>
                            <Switch
                                id="activo"
                                isOn={formik.values.activo}
                                onToggle={formik.handleChange}
                            />
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
