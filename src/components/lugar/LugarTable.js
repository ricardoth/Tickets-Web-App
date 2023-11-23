import { useContext, useEffect, useState } from "react";
import { FaCheck, FaPen, FaTimes, FaTrashAlt } from "react-icons/fa";
import { environment } from "../../environment/environment.dev";
import { basicAuth } from "../../types/basicAuth";
import { Buffer } from 'buffer';
import { types } from '../../types/types';

import Swal from 'sweetalert2';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { AuthContext } from "../../auth/authContext";
import { Loader } from "../ui/loader/Loader";
import { ExpandedRowLugar } from "./ExpandedRowLugar";
import { LugarEditModal } from "./LugarEditModal";
import { ReferencialMapModal } from "./ReferencialMapModal";

const UrlGetLugares = environment.UrlGetLugares;
const UrlDeleteLugar = environment.UrlGetLugares;

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const LugarTable = ({changeAddForm}) => {
    const { dispatch } = useContext(AuthContext);
    const [ loading, setLoading ] = useState(false);
    const [ lugares, setLugares ] = useState([]);
    const [ showEditLugar, setShowEditLugar ] = useState(false);
    const [ lugarEdit, setLugarEdit ] = useState({});

    const [ showReferencialMapModal, setShowReferencialMapModal ] = useState(false);
    const [ referencialMap, setReferencialMap ] = useState("");
    const { data, meta } = lugares;


    const fetchLugares = async () => {
        setLoading(true);
        await axios.get(UrlGetLugares, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        }).then(res => {
            let datos = res.data;
            setLugares(datos);
            setLoading(false);
        })
        .catch(err => {
            const {response} = err;
            const mensajesArray = response.data.map(x => x.errorMessage);
            Swal.fire('Ha ocurrido un error', mensajesArray.toString(), 'error');
            setLoading(false);
            setTimeout(() => {
                dispatch({ type: types.logout });
            }, 1000);
        });
    }

    useEffect(() => {
        fetchLugares();
        setLoading(false);
    }, [changeAddForm, showEditLugar]);
    
    if ( meta === undefined || data === undefined) return <Loader />;

    const handleDelete = (paramIdLugar) => {
        Swal.fire({
            title: 'Atención',
            text: '¿Desea Desactivar el Lugar?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async () => {
            try {
                setLoading(true);
                let response = await axios.delete(UrlDeleteLugar + `/${paramIdLugar}`, {
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                    },
                });
                if (response.status === 200) {
                    await fetchLugares();
                } 
                setLoading(false);
            } catch (error) {
                setLoading(false);
                const {response} = error;
                Swal.fire('Ha ocurrido un error', response.data, 'error');
            }
        });
    }

    const handleEdit = (paramLugar) => {
        setShowEditLugar(true);
        setLugarEdit(paramLugar);
    }

    const handleWatchReferencialMap = (paramLugar) => {
        setReferencialMap(paramLugar.mapaReferencial);
        setShowReferencialMapModal(true);
    }

    const columns = [
        {
            name: '#',
            selector: row => row.idLugar,
            sortable: true
        },
        {
            name: 'Nombre Lugar',
            selector: row => row.nombreLugar
        },
        {
            name: 'Ubicación',
            selector: row => row.ubicacion + ' ' + row.numeracion 
        },
        {
            name: 'Mapa Referencial',
            selector: row => (
                <button className="btn btn-outline-success" onClick={() => handleWatchReferencialMap(row)}>Ver Mapa</button>
            )
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
            name: "Acciones",
            cell: (row) => [
                <div key={row.idLugar}>
                    <button className='btn btn-danger' onClick={ (e) => handleDelete(row.idLugar)}>
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
                title="Lugares"
                className='animate__animated animate__fadeIn'
                columns={columns}
                data={data}
                pagination
                paginationTotalRows={lugares.length}
                responsive
                defaultSortAsc={true}
                expandableRows
                expandableRowsComponent={ExpandedRowLugar}
                noDataComponent={`No hay registros para mostrar`}
            />

            {showEditLugar && (
                <LugarEditModal show={showEditLugar} close={() => setShowEditLugar(false)} lugarEdit={lugarEdit} />
            ) }

            {
                showReferencialMapModal && (
                    <ReferencialMapModal show={showReferencialMapModal} close={() => setShowReferencialMapModal(false)} referencialMap={referencialMap} />
                )
            }
        </>
    )
}
