import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import { environment } from '../../environment/environment.dev';
import { Loader } from '../ui/loader/Loader';
import DataTable from 'react-data-table-component';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ModalTicketControlPanel } from './ModalTicketControlPanel';
import Swal from 'sweetalert2';
import { ModalTicket } from './ModalTicket';
import { types } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;
const URL_TICKET = environment.UrlGeneracionTicket;
const URL_TICKET_VOUCHER_PDF = environment.UrlGetTicketVoucherPDF;

export const TicketControlPanel = () => {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [ tickets, setTickets ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isOpenVoucher, setIsOpenVoucher ] = useState(false);
    const [ ticket, setTicket ] = useState();
    const [ base64Voucher , setBase64Voucher ] = useState("");
    const { data, meta } = tickets;

    const handleLogout = () => {
        dispatch({ type: types.logout });

        navigate("/login", {
            replace: true 
        });
    }

    const fetchTickets = async (page, row = 10) => {
        setLoading(!loading);
        await axios.get(URL_TICKET + `?PageSize=${row}&PageNumber=${page}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        }).then(res => {
            let datos = res.data;
            setTickets(datos);
            setLoading(false);
        })
        .catch( err => {
            Swal.fire('Ha ocurrido un error al realizar la petición a la API', `No se pudieron cargar los datos: ${err}`, 'error');

            setTimeout(() => {
                handleLogout();

            }, 1000)
        });
    }

    useEffect(() => {
        fetchTickets(page);
    }, [page]);


    if ( meta === undefined || data === undefined) return <Loader />;

    const handlePageChange = page => {
        setPage(page);
    }

    const handleRowsChange = row => {
        fetchTickets(1, row);
    }

    const closeModal = () => {
        setIsOpen(false);
    };

    const closeModalVoucher = () => {
        setIsOpenVoucher(false);
    }

    const openModal = (row) => {
        setTicket(row);
        setIsOpen(true);
    }

    const generarPrintTicket = async (row) => {
        await axios.get(URL_TICKET_VOUCHER_PDF + `?idTicket=${row.idTicket}`,{
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        })
        .then(res => {
            const {data} = res.data;
            setBase64Voucher(data.nombreTicketComprobante);
            setIsOpenVoucher(true);
        })
        .catch(err => {
            Swal.fire('Ha ocurrido un error al realizar la petición a la API', 'No se pudieron cargar los datos', 'error');

            setTimeout(() => {
                handleLogout();
            }, 1000)
        });

    }

    const desactivarTicket = async (row) => {
        if (row.activo) 
            row.activo = false;
        else 
            row.activo = true;
        
        Swal.fire({
            title: 'Atención',
            text: '¿Desea dar de ' + (row.activo ? 'Activar' : 'Desactivar') + ' el Ticket?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const responseDelete = await axios.delete(URL_TICKET + `?idTicket=${row.idTicket}&activo=${row.activo}`, {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                    },
                });
                if(responseDelete.status !== 200) {
                    Swal.fire('Ha ocurrido un error al realizar la petición a la API', 'No se pudieron cargar los datos', 'error');

                    setTimeout(() => {
                        handleLogout();
                    }, 1000)
                }

                fetchTickets(page);
                
            }
        });
    }

    const columns = [
        {
            name: 'Folio',
            selector: row => row.idTicket,
            sortable: true
        },
        {
            name: 'Evento',
            selector: row => row.evento.nombreEvento,
            sortable: true
        },
        {
            name: 'Usuario',
            selector: row => row.usuario.nombres + " " + row.usuario.apellidoP,
        },
        {
            name: 'Sector',
            selector: row => row.sector.nombreSector,
        },
        {
            name: 'Vigente',
            selector: row => (
                row.activo === true ? 
                <button className='btn btn-success'><FaCheck /></button> 
                : 
                <button className='btn btn-danger'><FaTimes /></button>  
            )
        },
        {
            name: "Detalle",
            cell: (row) => [
                <div className='justify-content-md-center' key={row.idTicket}>
                    <button className='btn btn-info' onClick={() => openModal(row)}>
                        <i className="bi bi-search"></i>
                    </button>
                    &nbsp;
                    <button className='btn btn-warning' onClick={() => generarPrintTicket(row)}>
                        <i className="bi bi-printer-fill"></i>
                    </button>
                    &nbsp;
                    <button className='btn btn-danger' onClick={() => desactivarTicket(row)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ],
            // ignoreRowClick: true,
            // allowOverflow: true,
            // button: true,
          },
    ];

    return (

        <div className='row mt-5'>
             <div className='d-flex justify-content-between'>
                <h1>Gestión de Tickets</h1>
            </div>
            <hr/>
                <DataTable
                    title="Tickets"
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

                <ModalTicketControlPanel isOpen={isOpen} closeModal={closeModal} ticketObj={ticket} />
                <ModalTicket isOpen={isOpenVoucher} closeModal={closeModalVoucher} base64Pdf={base64Voucher}/>
        </div>
        
    )
}
