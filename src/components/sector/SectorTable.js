import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/authContext";
import { Loader } from "../ui/loader/Loader";
import { environment } from "../../environment/environment.dev";
import { basicAuth } from "../../types/basicAuth";
import { Buffer } from 'buffer';
import { FaCheck, FaPen, FaTimes, FaTrashAlt } from "react-icons/fa";
import { types } from "../../types/types";

import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";


const UrlGetSectoresByEvento = environment.UrlGetSectoresByEvento;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const SectorTable = ({changeAddForm, idEvento}) => {
    const { dispatch } = useContext(AuthContext);
    const [ sectores, setSectores] = useState([]);
    const [ sectorEdit, setSectorEdit ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ showEditSector, setShowEditSector ] = useState(false);
    const { data } = sectores;

    useEffect(() => {
        if (idEvento > 0) {
            fetchSectores(idEvento);
        }
        setLoading(false);
    }, [changeAddForm, idEvento]);

    const fetchSectores = async (row) => {
        setLoading(!loading);

        let response = await axios.get(UrlGetSectoresByEvento + `${row}` , {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        })

        console.log(response)

        if (response.status === 200) {
            let datos = response.data;
            setSectores(datos);
            setLoading(loading);
        } else {
            Swal.fire('Ha ocurrido un error al realizar la petición a la API', 'No se pudieron cargar los datos, se cerrará la sesión automáticamente', 'error');
            setLoading(false);

            // setTimeout(() => {
            //     dispatch({ type: types.logout });
            // }, 1000);
        }
    }

    if (data === undefined) return <Loader />;

    const handleEdit = (sectorParam) => {

    }

    const handleDelete = async (idSectorParam) => {

    }
    
    const columns = [
        {
            name: '#',
            selector: row => row.idSector,
        },
        {
            name: 'Evento',
            selector: row => row.idEvento,
        },
        {
            name: 'Nombre',
            selector: row => row.nombreSector,
        },
        {
            name: 'Capacidad Total',
            selector: row => row.capacidadTotal,
        },
        {
            name: 'Capacidad Actual',
            selector: row => row.capacidadActual,
        },
        {
            name: 'Capacidad Disponible',
            selector: row => row.capacidadDisponible,
        },
        {
            name: 'Precio',
            selector: row =>  `${row.precio} CLP`,
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
                <div key={row.idSector}>
                    <button className='btn btn-danger' onClick={ (e) => handleDelete(row.idSector)}>
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
                title="Sectores"
                className='animate__animated animate__fadeIn'
                columns={columns}
                data={data}
                pagination
                paginationTotalRows={sectores.length}
                responsive
                defaultSortAsc={true}
            />
            {/* {showEditEvento && (
                <EventoEditModal show={showEditEvento} close={() => setShowEditEvento(false)} eventoEdit={eventoEdit} />
            ) } */}
        </>
    )
}
