import { useState } from "react";
import { useFormik } from "formik"
import { Modal } from "react-bootstrap"

import { Switch } from "../ui/switch/Switch";
import { Loader } from "../ui/loader/Loader";
import { Combobox } from "../ui/combobox/Combobox";

import { parserEvento } from "../../types/parsers";
import { environment } from "../../environment/environment.dev";
import { basicAuth } from "../../types/basicAuth";
import { Buffer } from 'buffer';

import * as Yup from 'yup';
import Swal from "sweetalert2";
import axios from "axios";

const UrlGetEventos = environment.UrlGetEventos;
const UrlSector = environment.UrlGetSectores;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const validationSchema = Yup.object().shape({
    nombreSector: Yup.string().required('El Nombre es requerido'),
});


export const SectorEditModal = ({show, close, sectorEdit}) => {
    const [ loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            idSector: sectorEdit.idSector,
            idEvento: sectorEdit.idEvento,
            nombreSector: sectorEdit.nombreSector,
            capacidadTotal: sectorEdit.capacidadTotal,
            capacidadActual: sectorEdit.capacidadActual,
            capacidadDisponible: sectorEdit.capacidadDisponible,
            precio: sectorEdit.precio,
            cargo: sectorEdit.cargo,
            total: sectorEdit.total,
            colorHexa: sectorEdit.colorHexa,
            activo: sectorEdit.activo
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            values.total = values.precio + values.cargo;

            Swal.fire({
                title: 'Atención',
                text: '¿Desea Editar el Sector?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(!loading);
                    try {
                        let response = await axios.put(`${UrlSector}?id=${values.idSector}`, values, {
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
            });
        }
    });

    return (
        <>
            { loading ? <Loader /> :
                <Modal
                    show={show}
                    onHide={close}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar un Sector</Modal.Title>    
                    </Modal.Header>

                    <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-lg-6">
                                    <label>Evento</label>
                                    <Combobox
                                        id={"idEvento"}
                                        value={formik.values.idEvento}
                                        setValue={formik.handleChange}
                                        url={UrlGetEventos}
                                        parser={parserEvento}
                                        tipoAuth={environment.BasicAuthType}
                                    />
                                </div>
                                <div className='col-lg-6'>
                                    <label>Nombre</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nombre" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="nombreSector" 
                                        value={formik.values.nombreSector} 
                                        autoComplete="off"
                                    />

                                    {formik.touched.nombreSector && formik.errors.nombreSector ? (
                                            <div style={{color:'red'}}>{formik.errors.nombreSector}</div>
                                            ) : null}
                                </div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-lg-4">
                                    <label>Capacidad Total</label>
                                    <input 
                                        type="number" 
                                        placeholder="Capacidad Total" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="capacidadTotal" 
                                        value={formik.values.capacidadTotal} 
                                        autoComplete="off"
                                    />

                                    {formik.touched.capacidadTotal && formik.errors.capacidadTotal ? (
                                            <div style={{color:'red'}}>{formik.errors.capacidadTotal}</div>
                                            ) : null}
                                </div>

                                <div className="col-lg-4">
                                    <label>Capacidad Actual</label>
                                    <input 
                                        type="number" 
                                        placeholder="Capacidad Actual" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="capacidadActual" 
                                        value={formik.values.capacidadActual} 
                                        autoComplete="off"
                                    />

                                    {formik.touched.capacidadActual && formik.errors.capacidadActual ? (
                                            <div style={{color:'red'}}>{formik.errors.capacidadActual}</div>
                                            ) : null}
                                </div>

                                <div className="col-lg-4">
                                    <label>Capacidad Disponible</label>
                                    <input 
                                        type="number" 
                                        placeholder="Capacidad Disponible" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="capacidadDisponible" 
                                        value={formik.values.capacidadDisponible} 
                                        autoComplete="off"
                                    />

                                    {formik.touched.capacidadDisponible && formik.errors.capacidadDisponible ? (
                                            <div style={{color:'red'}}>{formik.errors.capacidadDisponible}</div>
                                            ) : null}
                                </div>

                            
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-lg-4">
                                    <label>Precio</label>
                                    <input 
                                        type="number" 
                                        placeholder="$" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="precio" 
                                        value={formik.values.precio} 
                                        autoComplete="off"
                                    />
                                    {formik.touched.precio && formik.errors.precio ? (
                                            <div style={{color:'red'}}>{formik.errors.precio}</div>
                                            ) : null}
                                </div>

                                <div className="col-lg-4">
                                    <label>Cargo</label>
                                    <input 
                                        type="number" 
                                        placeholder="$" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="cargo" 
                                        value={formik.values.cargo} 
                                        autoComplete="off"
                                    />
                                    {formik.touched.cargo && formik.errors.cargo ? (
                                            <div style={{color:'red'}}>{formik.errors.cargo}</div>
                                            ) : null}
                                </div>

                                <div className="col-lg-4">
                                    <label>Total</label>
                                    <input 
                                        type="number" 
                                        placeholder="$" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="total" 
                                        value={formik.values.precio + formik.values.cargo} 
                                        autoComplete="off"
                                        disabled
                                    />
                                
                                </div>
                            </div>
                            <br/>

                            <div className="row">
                                <div className="col-lg-6">
                                    <label>Color</label>
                                    <input 
                                        type="color" 
                                        placeholder="Color" 
                                        className="form-control" 
                                        onChange={formik.handleChange} 
                                        name="colorHexa" 
                                        value={formik.values.colorHexa} 
                                        autoComplete="off"
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
