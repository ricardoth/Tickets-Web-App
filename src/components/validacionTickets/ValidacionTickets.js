import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';
import { parserEvento } from '../../types/parsers';
import { Buffer } from 'buffer';
import axios from 'axios';
import { basicAuth } from '../../types/basicAuth';
import { Accordion, Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { decrypAES } from '../../selectors/decriptarAES';
import { getColorStatusCode } from '../../selectors/getStatusCodeIcon';
import DataTable from 'react-data-table-component';
import { types } from '../../types/types';
import { AuthContext } from '../../auth/authContext';
import { Loader } from '../ui/loader/Loader';
import { Scanner } from '../ui/scanner/Scanner';
import * as Yup from 'yup';
import { formatDateDayMonthYear } from '../../types/formatDate';

const UrlValidarTicket = environment.UrlValidarAccesoTicket;
const UrlGetEventos = environment.UrlGetEventos;
const UrlGetAccesosEventosTicket = environment.UrlGetAccesosEventosTicket;
const UrlSalidaAccesoEvento = environment.UrlSalidaAccesoEvento;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const key = "claveAESparaDerivar";
const iv = "claveAESparaDerivar";

const validationSchema = Yup.object().shape({
    dataJson: Yup.string().required('El QR del Ticket es requetido'),
    idEvento: Yup.number().required('El Evento es requerido').min(1, 'Debe seleccionar un Evento'),
  });

export const ValidacionTicket = () => {
    const { dispatch } = useContext(AuthContext);
    const [ accesosTickets, setAccesosTickets ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const { data, meta } = accesosTickets;

    const fetchAccesosTickets = async (page, row = 10) => {
        setLoading(true);
        await axios.get(UrlGetAccesosEventosTicket + `${`?PageSize=${row}&PageNumber=${page}`}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        })
        .then(response => {
            let datos = response.data;
            setAccesosTickets(datos);
            setLoading(false);
        })
        .catch(err => {
              console.error("Ha ocurrido un error al realizar la Petición a API", err);
              Swal.fire('Ha ocurrido un error al realizar la petición a la API', 'No se pudieron cargar los datos', 'error');

              setTimeout(() => {
                    dispatch({ type: types.logout });
              }, 1000)
        })
    }
    
    const formik = useFormik({
        initialValues: {
            dataJson: "",
            idEvento: 0,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // E6n0y5Lg5/jS79jUs4wLjUGXxspn8NztRKOIC73n0WSFSdeSJ7x9EUZT2Yn5zbNtKQkdCmlCjkUYjLhjnxcfJDVRMOCi+Ko/+PKDru71zuGZi+bRXuQgu+3+2EkJpe4TKFJ/pr+gQVPcyyoTVdp1D50D5hCL/BN/aOsN6WYI9LZgdnwnk88MefACCU7vACJNT7KPxF81aeji7Dk25WRSHpRej9UPyubUd4OW7lXo4Wi1Hi3YHCUK5XTigoSZEjWB7jMZb7c2qXH2JglaJaz9eKrd6uCxozU3FK5wT6nmdJg=
            const decryptado = decrypAES(values.dataJson, key, iv);
            let jsonParam = JSON.parse(decryptado);
            let rutDv = jsonParam.RutUsuario.split('-');
            let rut = rutDv[0];
            let dv = rutDv[1];
           
            let accesoEventoTicket = {
                idTicket: jsonParam.IdTicket,
                rut: rut,
                dv: dv,
                idEvento: values.idEvento
            };

            setLoading(true);
            let response = await axios.post(UrlValidarTicket, accesoEventoTicket, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });

            const { data } = response.data;
 
            if(response.status === 200) {
                let color = getColorStatusCode(data.statusCode);
                Swal.fire(`${data.outputMessage}`, `Ticket N° ${accesoEventoTicket.idTicket}`, color);
                fetchAccesosTickets(page);
                formik.resetForm();
            }
            setLoading(false);
            
        },
    });

    useEffect(() => {
        fetchAccesosTickets(page);
    }, [page]);

    if ( meta === undefined || data === undefined) return <Loader />;

    const salidaAccesoEvento = async (param) => {
        setLoading(true);
        let response = await axios.put(`${UrlSalidaAccesoEvento}?idAccesoEvento=${param.idAccesoEvento}`, null, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        });

        if(response.status === 200) {
            Swal.fire(`Salida del Evento`, `Ticket N° ${param.idTicket}`, 'success');

        }
        fetchAccesosTickets(page);
        setLoading(false);
    }    

    const handlePageChange = page => {
        setPage(page);
    }

    const handleRowsChange = row => {
        fetchAccesosTickets(1, row);
    }

    const handleScanSuccess = (scannedValue) => {
        formik.setFieldValue('dataJson', scannedValue);
    };

    const columns = [
        {
            name: '#',
            selector: row => row.idAccesoEvento,
            sortable: true
        },
        {
            name: 'N° Ticket',
            selector: row => row.idTicket,
        },
        {
            name: 'Usuario',
            selector: row => row.nombres + ' ' + row.apellidoP
        },
        {
            name: 'Rut',
            selector: row => row.rut + '-' + row.dv 
        },
        {
            name: 'Fecha Entrada',
            selector: row => formatDateDayMonthYear(row.fechaHoraEntrada)
        },
        {
            name: 'Fecha Salida',
            selector: row =>  {
                let celda = "";
                if( row.idEstadoTicket == 1) {
                    celda = row.fechaHoraSalida === null ? 
                        <button className='btn text-info bg-dark' onClick={() => salidaAccesoEvento(row)}>Marcar Salida</button> : formatDateDayMonthYear(row.fechaHoraSalida);
                } else {
                    celda = row.fechaHoraSalida === null ? '-' :  formatDateDayMonthYear(row.fechaHoraSalida);
                }
                 
                return celda;
            } 
        },
        {
            name: 'Estado Ticket',
            selector: row => 
            {
                let color = getColorStatusCode(row.idEstadoTicket);
                return  <h5>
                            <Badge pill bg={color}>
                                {row.estadoTicket}
                            </Badge>
                        </h5>
            }
        }
    ];

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Validación de Entradas</h1>
            </div>
            <hr/>

            <section>
                <Accordion defaultActiveKey={0}>
                    <Accordion.Item eventKey='0'>
                        <Accordion.Header>Presione Aquí para validar un ticket manualmente</Accordion.Header> 

                        <Accordion.Body>
                            <form className="container animate__animated animate__fadeIn"  onSubmit={formik.handleSubmit} >
                                <div className='row' >
                                    <div className='col-lg-12'>
                                    <label>Evento</label>
                                        <Combobox
                                            id="idEvento"
                                            name="idEvento"
                                            value={formik.values.idEvento} 
                                            setValue={formik.handleChange} 
                                            url={UrlGetEventos}
                                            parser={parserEvento}
                                            tipoAuth={environment.BasicAuthType}
                                        /> 
                                        {formik.touched.idEvento && formik.errors.idEvento ? (
                                            <div style={{color:'red'}}>{formik.errors.idEvento}</div>
                                        ) : null}

                                    </div>

                                    <div className='col-lg-12'>
                                        <label>Ticket</label>
                                        
                                        <Scanner 
                                            onScanSuccess={handleScanSuccess}
                                        />

                                        <br/>
                                        <input 
                                            type="password" 
                                            placeholder="QR Ticket" 
                                            className="form-control" 
                                            name="dataJson"
                                            value={formik.values.dataJson} 
                                            disabled
                                        />

                                        {formik.touched.dataJson && formik.errors.dataJson ? (
                                            <div style={{color:'red'}}>{formik.errors.dataJson}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <br/>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className='reader'>

                                        </div>
                                    </div>
                                    
                                </div>
                                <div className='d-grid gap-2'>
                                    <button className='btn btn-primary btn-lg'>Validar</button>
                                </div>
                            </form>
                        </Accordion.Body>
                        
                    </Accordion.Item>
                </Accordion>

              
            </section>

            <section>
                <div className='row mt-3'>
                    <DataTable
                        title="Tickets Validados"
                        className='animate__animated animate__fadeIn'
                        columns={columns}
                        data={data}
                        pagination
                        paginationServer
                        paginationTotalRows={meta.totalCount}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handleRowsChange}
                        responsive
                        defaultSortAsc={true}
                    />
                
                    

                </div>
            </section>
        </div>
    )
}
