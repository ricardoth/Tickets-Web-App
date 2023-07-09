import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import { environment } from '../../environment/environment.dev';
import { Loader } from '../ui/loader/Loader';
import DataTable from 'react-data-table-component';
import { FaCheck, FaPen, FaTimes, FaTrashAlt } from 'react-icons/fa';

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;
const URL_TICKET = environment.UrlGeneracionTicket;

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
        name: 'Monto Pago',
        selector: row => row.montoPago
    },
    {
        name: 'Vigente',
        selector: row => (
            row.activo === true ? <FaCheck /> : <FaTimes />
        )
    },
    {
        name: "Acciones",
        cell: (row) => [
            <div key={row.idMenu}>
                <button className='btn btn-danger'>
                    <FaTrashAlt />
                </button>
            </div>
        ],
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
];

export const TicketControlPanel = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);

    const { data, meta } = tickets;

    const fetchTickets = async (page, row = 10) => {
        setLoading(true);
        console.log(page)
        await axios.get(URL_TICKET + `?PageSize=${row}&PageNumber=${page}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        }).then(res => {
            let datos = res.data;
            setTickets(datos);
            setLoading(false);
        })
        .catch( err => console.log(err));
        
    }

    useEffect(() => {
        console.log(page)
        console.log(data)

        fetchTickets(page);
    }, [page]);

    if ( meta == undefined || data == undefined) return 'Loading';

    const handlePageChange = page => {
        setPage(page);
    }

    const handleRowsChange = row => {
        setPage(page, row);
    }

    return (
        <div className='row mt-5'>
             <div className='d-flex justify-content-between'>
                <h1>Gestión de Tickets</h1>
            </div>
            <hr/>
            
            <ul>
         

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

            
            {/* {
                loading ? <Loader /> : 
                tickets.map((row) => (

                    <li>AA {JSON.stringify(row)}</li>
                ))
            } */}
            </ul>
        </div>
        
    )
}
