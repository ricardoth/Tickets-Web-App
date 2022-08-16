import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'; 
import { FaTrashAlt, FaCheck, FaTimes, FaPen } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { environment } from '../../environment/environment.dev';
import { MenuEditModal } from './MenuEditModal';

const endpoint = environment.UrlApiMenu + "/";

export const MenuTable = ({menus, setMenus}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuEdit, setMenuEdit] = useState({});

    useEffect(() => {
        setMenus(endpoint);
    }, [menuEdit]);

    const handleDelete = (e, idMenu) => {
        e.preventDefault();

        Swal.fire({
            title: 'Atención',
            text: '¿Desea eliminar el menú?',
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(endpoint + idMenu, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    const temp = [...menus];
                    const index = temp.findIndex(x => x.idMenu === idMenu);
                    temp.splice(index, 1);
                    setMenus(endpoint);
                    Swal.fire('Eliminado!', '', 'success')
                })
                .catch(err => console.log(err)); 
              }
        });
    }

    const handleEdit = (idMenu, menu) => {
        setMenuEdit(menu.idMenu === idMenu ? menu : menuEdit);
        setTimeout(() => {
             setShowMenu(true);
        }, 100);
    }
    
    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true
        },
        {
            name: 'Padre',
            selector: row => row.padre,
        },
        {
            name: 'Url',
            selector: row => row.url
        },
        {
            name: 'Indicador Menú',
            selector: row => row.esPadre === true ? 'Menú Padre' : 'Menú Hijo'
        },
        {
            name: 'Menú con Hijos',
            selector: row => row.tieneHijos === true ? 'Si' : 'No'
        },
        {
            name: 'Vigente',
            selector: row => (
                row.esActivo === true ? <FaCheck /> : <FaTimes />
            )
        },
        {
            name: "Acciones",
            cell: (row) => [
                <div key={row.idMenu}>
                    <button className='btn btn-danger' onClick={ (e) => handleDelete(e,row.idMenu)}>
                        <FaTrashAlt />
                    </button>,
                    <button className='btn btn-primary' onClick={ () => handleEdit(row.idMenu, row)}>
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
                title="Menús"
                className='animate__animated animate__fadeIn'
                columns={columns}
                data={menus}
                pagination
                responsive
                defaultSortAsc={true}
            />
            <MenuEditModal show={showMenu} close={() => setShowMenu(false)} menuEdit={menuEdit} setMenuEdit={setMenuEdit}/>
        </>
        
    )
}
