import { useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'
import { Loader } from '../ui/loader/Loader';
import axios from 'axios';
import { Buffer } from 'buffer';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/basicAuth';
import { types } from '../../types/types';
import Swal from 'sweetalert2';
import { AuthContext } from '../../auth/authContext';
import { FaCheck, FaPen, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { UsuarioEditModal } from './UsuarioEditModal';

const UrlGetUsuariosTicket = environment.UrlGetUsuarios;
const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;

export const UsuarioTable = ({changeAddForm}) => {
    const { dispatch } = useContext(AuthContext);
    const [ page, setPage ] = useState(1);
    const [ loading, setLoading ] = useState(false);
    const [ usuarios, setUsuarios ] = useState([]);
    const [ showEditUser, setShowEditUser ] = useState(false);
    const [ userEdit, setUserEdit ] = useState({});
    const { data, meta } = usuarios;

    const fetchUsuarios = async (page, row = 10) => {
        setLoading(true);
        await axios.get(UrlGetUsuariosTicket + `?PageSize=${row}&PageNumber=${page}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        }).then(res => {
            let datos = res.data;
            setUsuarios(datos);
            setLoading(false);
        })
        .catch( err => {
            Swal.fire('Ha ocurrido un error al realizar la petición a la API', `No se pudieron cargar los datos: ${err}`, 'error');

            setTimeout(() => {
                dispatch({ type: types.logout });
                localStorage.removeItem('user');
            }, 1000)
        });

        setLoading(false);
    }

    useEffect(() => {
        fetchUsuarios(page);
        setLoading(false);
    }, [changeAddForm, showEditUser, page]);
    

    if ( meta === undefined || data === undefined) return <Loader />;
    
    const handlePageChange = page => {
        setPage(page);
    }

    const handleRowsChange = row => {
        fetchUsuarios(1, row);
    }

    const handleDelete = (paramIdUser) => {
        Swal.fire({
            title: 'Atención',
            text: '¿Desea Desactivar el Usuario?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async () => {
            setLoading(true);
            let response = await axios.delete(`${UrlGetUsuariosTicket}/${paramIdUser}`,{
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                },
            });

            if (response.status === 200) {
                fetchUsuarios(1);
            } else {
                Swal.fire('Ha ocurrido un error', 'No se pudo eliminar el elemento', 'error');
            }

            setLoading(false);
        });
    }

    const handleEdit = (paramUser) => {
        setShowEditUser(true);
        setUserEdit(paramUser);
    }

    const columns = [
        {
            name: '#',
            selector: row => row.idUsuario,
            sortable: true
        },
        {
            name: 'Tipo Usuario',
            selector: row => row.tipoUsuario.nombreTipoUsuario,
            sortable: true
        },
        {
            name: 'Rut',
            selector: row => {
                if (!row.esExtranjero) {
                    return row.rut + '-' + row.dv;
                } else {
                    return '-';
                }
            },
            sortable: true
        },
        {
            name: 'Nombre',
            width: '180px',
            selector: row => row.nombres + " " + row.apellidoP,
        },
        {
            name: 'Correo',
            width: '180px',
            selector: row => row.correo,
        },
        {
            name: 'Teléfono',
            selector: row => row.telefono,
        },
        {
            name: 'Dirección',
            width: '180px',
            selector: row => row.direccion,
        },
        {
            name: 'Es Extranjero',
            selector: row => ( 
                row.esExtranjero === true ? 
                <button className='btn btn-success'><FaCheck /></button> 
                : 
                <button className='btn btn-danger'><FaTimes /></button>  
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
                <div key={row.idUsuario}>
                    <button className='btn btn-danger' onClick={ (e) => handleDelete(row.idUsuario)}>
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


            {showEditUser && (
                <UsuarioEditModal show={showEditUser} close={() => setShowEditUser(false)} userEdit={userEdit} />
            ) }
        </>
        
    )
}
