import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { FaCheck, FaPen, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import Swal from 'sweetalert2';
import { MedioPagoEditModal } from './MedioPagoEditModal';
import { BannerModal } from './BannerModal';
import { Loader } from '../ui/loader/Loader';

const URL_MEDIO_PAGO = environment.UrlGetMedioPagos;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const MedioPagoTable = ({changeAddForm}) => {
    const [ mediosPagos, setMediosPagos ] = useState([]);
    const [ medioPagoEdit, setMedioPagoEdit ] = useState({});
    const [ showEditMedioPago, setShowEditMedioPago ] = useState(false);
    const [ showBanner, setShowBanner ] = useState(false);
    const [ banner, setBanner ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const { data } = mediosPagos;

    const fetchMediosPagos = async () => {
        try {
            let response = await axios.get(URL_MEDIO_PAGO, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });

            if(response.status === 200) {
                setMediosPagos(response.data);
            }
        } catch (error) {
            Swal.fire('Hubo un error al obtener los medios de pago', error.response.data.Message);
        }
    }

    useEffect(() => {
        fetchMediosPagos();
    }, [changeAddForm, showEditMedioPago]);
    

    const handleDelete = async (paramId) => {
        Swal.fire({
            title: 'Atención',
            text: '¿Desea Desactivar el Medio de Pago?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async () => {
            try {
                setLoading(true);
                let response = await axios.delete(URL_MEDIO_PAGO + `/${paramId}`, {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                    },
                });
                if (response.status === 200) {
                    await fetchMediosPagos();
                } 
                setLoading(false);
            } catch (error) {
                setLoading(false);
                const {response} = error;
                Swal.fire('Ha ocurrido un error', response.data, 'error');
            }
        });
    }

    const handleEdit = (paramMedioPago) => {
        setShowEditMedioPago(true);
        setMedioPagoEdit(paramMedioPago);
    }

    const handleWatchBanner = (paramMedioPago) => {
        setBanner(paramMedioPago.urlImageBlob);
        setShowBanner(true);
    }

    const columns = [
        {
            name: '#',
            selector: row => row.idMedioPago,
            width: '100px',
        },
        {
            name: 'Medio Pago',
            selector: row => row.nombreMedioPago,
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
        },
        {
            name: 'Banner',
            selector: row => (
                <button className="btn btn-outline-success" onClick={() => handleWatchBanner(row)}>Ver Banner</button>
            )
        },
        {
            name: 'Vigente',
            width: '100px',
            selector: row => (
                row.activo === true ? <FaCheck /> : <FaTimes />
            )
        },
        {
            name: "Acciones",
            width: '100px',
            cell: (row) => [
                <div key={row.idMedioPago}>
                    <button className='btn btn-danger' onClick={ (e) => handleDelete(row.idMedioPago)}>
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

    if ( data === undefined) return <Loader />;

    return (
        <>
            <h6>*Para agregar un medio pago se debe contactar al Administrador para agregar la implementación del Servicio.</h6>
            <DataTable
                title="Medios de Pago"
                className='animate__animated animate__fadeIn'
                columns={columns}
                data={data}
                pagination
                paginationTotalRows={mediosPagos.length}
                responsive
                defaultSortAsc={true}
                noDataComponent={`No hay registros para mostrar`}
            />

            {showEditMedioPago && (
                <MedioPagoEditModal show={showEditMedioPago} close={() => setShowEditMedioPago(false)} medioPagoEdit={medioPagoEdit} />
            ) }

            {
                showBanner && (
                    <BannerModal show={showBanner} close={() => setShowBanner(false)} banner={banner} />
                )
            }
        </>
    )
}
