import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { formatDateDayMonthYear } from '../../types/formatDate';
import { Loader } from '../ui/loader/Loader';

const URL_PREFERENCE_TICKETS = environment.UrlGetPreferenceTickets;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const MercadoPagoTickets = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const fetchMercadoPagoTickets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(URL_PREFERENCE_TICKETS, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                }
            });
    
            const {data} = response.data;
            setTickets(data);
            setLoading(false);
        } catch (error) {
            setTickets([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMercadoPagoTickets();
    }, []);

    const columns = [
        {
            name: '#',
            selector: row => row.idPreference,
            sortable: true
        },
        {
            name: 'Usuario',
            selector: row => row.usuario.nombres + " " + row.usuario.apellidoP,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Evento',
            selector: row => row.evento.nombreEvento,
            sortable: true,
             width: "200px"
        },
        {
            name: 'Sector',
            selector: row => row.sector.nombreSector,
            sortable: true,
            width: "200px"
        },
        {
            name: 'Monto Pago',
            selector: row => row.montoPago,
            sortable: true,
            width: "150px"
        },
        {
            name: 'Monto Total',
            selector: row => row.montoTotal,
            sortable: true,
            width: "150px"
        },
        {
            name: 'Ticket Descargado',
            selector: row => (
                row.descargados === true ? 
                <button className='btn btn-success'><FaCheck /></button> 
                : 
                <button className='btn btn-danger'><FaTimes /></button>  
            ),
            width: "150px"
        },
        {
            name: 'Merchant Order ID',
            selector: row => row.merchantOrder?.id,
            sortable: true,
            width: "150px"
        },
        {
            name: 'Merchant Status',
            selector: row => row.merchantOrder?.status,
            sortable: true,
            width: "100px"
        },
        {
            name: 'Order Status',
            selector: row => row.merchantOrder?.orderStatus,
            sortable: true,
            width: "150px"
        },
        {
            name: 'Fecha Registro',
            selector: row => formatDateDayMonthYear(row.fechaTicket),
            sortable: true,
            width: "150px"
        },
        {
            name: 'Hash Preference',
            selector: row => row.preferenceCode,
            width: "220px"
        },
        {
            name: 'Hash Transaction',
            selector: row => row.transactionId,
            width: "220px"
        },
    ]

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Trazabilidad Mercado Pago</h1>
            </div>
            <hr/>
            {
                loading ? <Loader/> : 
                <DataTable
                    title="Acciones registradas"
                    className='animate__animated animate__fadeIn'
                    columns={columns}
                    data={tickets}
                    responsive
                    pagination
                    paginationTotalRows={tickets.length}
                    defaultSortAsc={true}
                    noDataComponent={`No hay registros para mostrar`}
                />
            }
            
        </div>
    )
}