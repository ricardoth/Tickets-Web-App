import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { environment } from '../../environment/environment.dev';
import { Combobox } from '../ui/combobox/Combobox';
import { parserEvento } from '../../types/parsers';
import { Buffer } from 'buffer';
import axios from 'axios';
import { basicAuth } from '../../types/basicAuth';
import { Badge } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { decrypAES } from '../../selectors/decriptarAES';
import { getColorStatusCode } from '../../selectors/getStatusCodeIcon';
import DataTable from 'react-data-table-component';
import { types } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { Loader } from '../ui/loader/Loader';
import { Scanner } from '../ui/scanner/Scanner';

const urlValidarTicket = environment.UrlValidarAccesoTicket;
const UrlGetEventos = environment.UrlGetEventos;
const UrlGetAccesosEventosTicket = environment.UrlGetAccesosEventosTicket;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

const key = "claveAESparaDerivar";
const iv = "claveAESparaDerivar";

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
        selector: row => row.fechaHoraEntrada
    },
    {
        name: 'Fecha Salida',
        selector: row =>  row.fechaHoraSalida == null ? '-' : row.fechaHoraSalida
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

export const ValidacionTicket = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [ accesosTickets, setAccesosTickets ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPage(page);
        fetchAccesosTickets(page);
    }, []);

    const fetchAccesosTickets = async (page, row = 10) => {
        setLoading(true);
        await axios.get(UrlGetAccesosEventosTicket + `${`?PageSize=${row}&PageNumber=${page}`}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        })
        .then(response => {

            setAccesosTickets(response.data.data);
            setMeta(response.data.meta);
            setLoading(false);
        })
        .catch(err => {
              console.error("Ha ocurrido un error al realizar la Petición a API", err);
              Swal.fire('Ha ocurrido un error al realizar la petición a la API', 'No se pudieron cargar los datos', 'error');

              setTimeout(() => {
                  handleLogout();
              }, 1000)
        })
    }

    
    const formik = useFormik({
        initialValues: {
            dataJson: "",
            idEvento: 0,
        },
        onSubmit: async (values) => {
            // E6n0y5Lg5/jS79jUs4wLjUGXxspn8NztRKOIC73n0WSFSdeSJ7x9EUZT2Yn5zbNtKQkdCmlCjkUYjLhjnxcfJDVRMOCi+Ko/+PKDru71zuGZi+bRXuQgu+3+2EkJpe4TKFJ/pr+gQVPcyyoTVdp1D50D5hCL/BN/aOsN6WYI9LZgdnwnk88MefACCU7vACJNT7KPxF81aeji7Dk25WRSHpRej9UPyubUd4OW7lXo4Wi1Hi3YHCUK5XTigoSZEjWB7jMZb7c2qXH2JglaJaz9eKrd6uCxozU3FK5wT6nmdJg=
            const decryptado = decrypAES(values.dataJson, key, iv);
            let jsonParam = JSON.parse(decryptado);
            let rutDv = jsonParam.RutUsuario.split('-');
            let rut = rutDv[0];
            let dv = rutDv[1];
           
            console.log(jsonParam)

            let accesoEventoTicket = {
                idTicket: jsonParam.IdTicket,
                rut: rut,
                dv: dv,
                idEvento: values.idEvento
            };

            setLoading(true);
            let response = await axios.post(urlValidarTicket, accesoEventoTicket, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });

            const { data } = response.data;
 
            if(response.status === 200) {
                let color = getColorStatusCode(data.statusCode);
                Swal.fire(`${data.outputMessage}`, `Ticket N° ${accesoEventoTicket.idTicket}`, color);
                handlePageChange(page);
                formik.resetForm();
            }
            setLoading(false);
            
        },
    });

    const handleLogout = () => {
        dispatch({ type: types.logout });

        navigate("/login", {
            replace: true 
        });
    }

    const handlePageChange = page => {
        setPage(page);
        fetchAccesosTickets(page);
    }

    const handleRowsChange = row => {
        fetchAccesosTickets(1, row);
    }

    const handleScanSuccess = (scannedValue) => {
        formik.setFieldValue('dataJson', scannedValue);
    };

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Validación de Entradas</h1>
            </div>
            <hr/>

            <section>
                <form className="container animate__animated animate__fadeIn"  onSubmit={formik.handleSubmit} >
                    <div className='row'>
                        <div className='col-lg-8'>
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
                        </div>

                        <div className='col-lg-8'>
                            <label>Ticket</label>
                            
                            <Scanner 
                                onScanSuccess={handleScanSuccess}
                            />

                            <input 
                                type="text" 
                                placeholder="Ticket" 
                                className="form-control" 
                                // onChange={formik.handleChange} 
                                name="dataJson"
                                value={formik.values.dataJson} 
                            />
                        </div>



                    </div>
                    <div className='row'>
                        <div className='reader'>

                        </div>
                    </div>

                    <button className='btn btn-primary'>Validar</button>
                </form>
            </section>

            

            <section>
                <div className='row mt-3'>
                    {   loading ? <Loader /> : 
                        
                        <DataTable
                            title="Tickets Validados"
                            className='animate__animated animate__fadeIn'
                            columns={columns}
                            data={accesosTickets}
                            responsive
                            defaultSortAsc={true}
                            pagination
                            paginationServer
                            paginationTotalRows={meta.totalCount}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsChange}
                        />
                    }
                    

                </div>
            </section>
        </div>
    )
}
