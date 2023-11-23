import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { FaCheck, FaPen, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import { Loader } from '../ui/loader/Loader';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import Swal from 'sweetalert2';
import { EventoEditModal } from './EventoEditModal';

const UrlGetEventos = environment.UrlGetEventos;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const EventoTable = ({changeAddForm}) => {
    const { dispatch } = useContext(AuthContext);
    const [ eventos, setEventos ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ showEditEvento, setShowEditEvento ] = useState(false);
    const [ eventoEdit, setEventoEdit ] = useState({});
    const { data } = eventos;

    useEffect(() => {
        fetchEventos();
    }, [changeAddForm, showEditEvento]);
 
    const fetchEventos = async () => {
        setLoading(!loading);
        let response = await axios.get(UrlGetEventos , {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        });
        if(response.status === 200) {
            setEventos(response.data);
            setLoading(loading);
        } else {
            Swal.fire('Ha ocurrido un error al realizar la petición a la API', 'No se pudieron cargar los datos, se cerrará la sesión automáticamente', 'error');

            setTimeout(() => {
                dispatch({ type: types.logout });
            }, 1000);
        }
    }

    if ( data === undefined) return <Loader />;

    const handleDelete = async (idEvento) => {
        Swal.fire({
            title: 'Atención',
            text: '¿Desea Desactivar el Evento?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async (values) => {
            let response = await axios.delete(`${UrlGetEventos}/${idEvento}`  , {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });
    
            if(response.status === 200) {
                fetchEventos();
            } else {
                Swal.fire("Ha ocurrido un error", "No se pudo eliminar el elemento", "error");
            }
        });
    }

    const handleEdit = (eventoParam) => {
        setEventoEdit(eventoParam);
        setTimeout(() => {
            setShowEditEvento(true);
        }, 100);
    }

    const columns = [
        {
            name: '#',
            selector: row => row.idEvento,
        },
        {
            name: 'Lugar',
            selector: row => row.lugar.nombreLugar,
        },
        {
            name: 'Nombre',
            selector: row => row.nombreEvento,
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
        },
        {
            name: 'Dirección',
            selector: row => row.direccion,
        },
        {
            name: 'Fecha Evento',
            selector: row => {
                let formatFechaEvento;
                    formatFechaEvento = new Intl.DateTimeFormat("es-ES", {
                        dateStyle: 'medium',
                        timeStyle: 'medium'
                    }).format(new Date(row.fecha));
                return formatFechaEvento;
            },
        },
        {
            name: 'Observación',
            selector: row => row.observacion,
        },
        {
            name: 'Productora Responsable',
            selector: row => row.productoraResponsable,
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
                <div key={row.idEvento}>
                    <button className='btn btn-danger' onClick={ (e) => handleDelete(row.idEvento)}>
                        <FaTrashAlt />
                    </button>&nbsp;
                    <button className='btn btn-primary' onClick={ () => handleEdit(row)}>
                        <FaPen />
                    </button>
                </div>
            ],
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <>
            <DataTable
                title="Eventos"
                className='animate__animated animate__fadeIn'
                columns={columns}
                data={data}
                pagination
                paginationTotalRows={eventos.length}
                responsive
                defaultSortAsc={true}
                noDataComponent={`No hay registros para mostrar`}
            />
            {showEditEvento && (
                <EventoEditModal show={showEditEvento} close={() => setShowEditEvento(false)} eventoEdit={eventoEdit} />
            ) }
        </>
    )
}
