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
import { AuthContext } from '../../auth/authContext';
import { FilterControlPanel } from './FilterControlPanel';
import * as XLSX from 'xlsx';
import { formatDateDayMonthYear } from '../../types/formatDate';

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;
const URL_TICKET = environment.UrlGeneracionTicket;
const URL_TICKET_VOUCHER_PDF = environment.UrlGetTicketVoucherPDF;
const URL_TICKET_EXCEL = environment.UrlGetTicketsExcel;

export const TicketControlPanel = () => {
    const { dispatch } = useContext(AuthContext);
    const [ page, setPage ] = useState(1);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isOpenVoucher, setIsOpenVoucher ] = useState(false);
    const [ ticket, setTicket ] = useState();
    const [ base64Voucher , setBase64Voucher ] = useState("");

    const [ selectedEvento, setSelectedEvento ] = useState(0);
    const [ selectedSector, setSelectedSector ] = useState(0);

    const [ data, setData ] = useState([]);
    const [ meta, setMeta ] = useState({});

    const [ isLoading, setIsLoading ] = useState(false);

    const fetchTickets = async (page, row = 10, eventoParam, sectorParam) => {
        let urlBase = URL_TICKET + `?PageSize=${row}&PageNumber=${page}`;

        if (eventoParam != undefined && eventoParam != 0) 
            urlBase = urlBase + `&IdEvento=${eventoParam}`;

        if (sectorParam != undefined && sectorParam != 0)
            urlBase = urlBase + `&IdSector=${sectorParam}`;

        try {
            let response = await axios.get(urlBase, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });
            const {data, meta} = response.data;
            setData(data);
            setMeta(meta);
        } catch (error) {
            setData([]);
            setMeta({});
        }
    }

    useEffect(() => {
        fetchTickets(page, 10, selectedEvento, selectedSector);
    }, [page]);

    useEffect(() => {
        fetchTickets(page, 10, selectedEvento);
    }, [selectedEvento]);
    
    useEffect(() => {
        fetchTickets(page, 10, selectedEvento, selectedSector);
    }, [selectedSector]);
    
    if ( meta === undefined || data === undefined) return <Loader />;

    const handlePageChange = page => {
        setPage(page);
    }

    const handleRowsChange = row => {
        fetchTickets(1, row, selectedEvento, selectedSector);
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
                dispatch({ type: types.logout });
                localStorage.removeItem('user');
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
                        dispatch({ type: types.logout });
                        localStorage.removeItem('user');
                    }, 1000)
                }

                fetchTickets(page);
                
            }
        });
    }

    const generarReporte = async (eventoParam, sectorParam) => {
        setIsLoading(true);
        let urlBase = URL_TICKET_EXCEL;
        if (eventoParam != undefined && eventoParam != 0) 
            urlBase = urlBase + `?IdEvento=${eventoParam}`;

        if (sectorParam != undefined && sectorParam  != 0)
            urlBase = urlBase + `&IdSector=${sectorParam}`;

        let response = await axios.get(urlBase, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            }
        });

        if(response.status !== 200)
            Swal.fire("Atención!", "Ha ocurrido un error al generar el reporte excel", "error");
        
        const {data} = response.data;
        const extractedData = extractFieldsExcel(data);
        const workSheet = XLSX.utils.json_to_sheet(extractedData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Reporte Tickets');
        XLSX.writeFile(workBook, 'Reporte Excel Tickets Resonance Pass.xlsx');
        setIsLoading(false);
        fetchTickets(1);
    } 

    const extractFieldsExcel = (source) => {
        return source.map(item => ({
            "N° Ticket": item.idTicket,
            "Cliente": item.usuario ?  `${item.usuario.nombres} ${item.usuario.apellidoP} ${item.usuario.apellidoM}` : '',
            "RUT": item.usuario.rut != null ? `${item.usuario.rut}-${item.usuario.dv}` : 'Extranjero',
            "Tipo Cliente": item.usuario.esExtranjero ? 'Extranjero': 'Chileno',
            "Correo": item.usuario.correo,
            "Evento": item.evento ? item.evento.nombreEvento : '',
            "Sector": item.sector ? item.sector.nombreSector : '',
            "Precio Entrada": item.sector.precio,
            "Cargo": item.sector.cargo,
            "Entrada + Cargo": item.sector.total,
            "Fecha Ticket":  formatDateDayMonthYear(item.fechaTicket),
            "Medio Pago": item.medioPago ? item.medioPago.nombreMedioPago : '',
            " ": "----",
            "Monto Total Cliente": item.montoTotal,



        }))
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
            sortable: true
        },
        {
            name: 'Sector',
            selector: row => row.sector.nombreSector,
            sortable: true
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
        <>
            {
                isLoading ? <Loader /> : 
                <div className='row mt-5'>
                    <div className='d-flex justify-content-between'>
                        <h1>Gestión de Tickets</h1>
                        <div className="p-2">
                            <button className='btn btn-success' onClick={() => generarReporte(selectedEvento, selectedSector)}>Generar Reporte  <i className="bi bi-filetype-xlsx"></i></button>
                        </div>
                    </div>
                    <hr/>

                    <FilterControlPanel 
                        selectedEvento={selectedEvento}
                        setSelectedEvento={setSelectedEvento}
                        selectedSector={selectedSector}
                        setSelectedSector={setSelectedSector}
                    />

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
                            noDataComponent={`No hay registros para mostrar`}
                        />

                        <ModalTicketControlPanel isOpen={isOpen} closeModal={closeModal} ticketObj={ticket} />
                        <ModalTicket isOpen={isOpenVoucher} closeModal={closeModalVoucher} base64Pdf={base64Voucher}/>
                </div>
            }
        </>
    )
}
