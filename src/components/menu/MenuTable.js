import React, { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component'; 
import { FaTrashAlt, FaCheck, FaTimes, FaPen } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { environment } from '../../environment/environment.dev';
import { MenuModal } from './MenuModal';
const endpoint = environment.UrlApiMenu + "/";

export const MenuTable = ({menus, setMenus}) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuEdit, setMenuEdit] = useState({});


    useEffect(() => {
        setMenus(endpoint);
    }, [setMenus])
    

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
                    console.log(data)
                    const temp = [...menus];
                    const index = temp.findIndex(x => x.idMenu === idMenu);
                    temp.splice(index, 1);
                    setMenus(temp);
                    Swal.fire('Eliminado!', '', 'success')
                })
                .catch(err => console.log(err)); 
              }
        });
    }

    
    const handleEdit = (e, menu) => {
        setMenuEdit(menu);

        setShowMenu(true);
        console.log(menu)
        // const temp = [...menus];
        // const index = temp.findIndex(x => x.idMenu === idMenu);

        // Swal.fire({
        //     title: 'Atención',
        //     text: '¿Desea editar el menú?',
        //     icon: 'warning',
        //     confirmButtonText: 'Aceptar'
        // })
        // .then(response => response.json())
        // .then( data => {
        //     let temp = [...menus];
        //     const index = temp.findIndex(x => x.idMenu === idMenu);
        //     // var o = temp[index];
        //     // o.nombre= "Master Data PAge";
        //     setMenus(temp);
        // })
        // .catch(err => console.log(err));

        
        // setMenus([...menus, menu]);
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
            selector: row => row.tieneHijos === true ? <FaCheck /> : <FaTimes />
        },
        {
            name: "Acciones",
           
            cell: (row) => [
                <div key={row.idMenu}>
                    <button className='btn btn-danger' onClick={ (e) => handleDelete(e,row.idMenu)}>
                        <FaTrashAlt />
                    </button>,
                    <button className='btn btn-primary' onClick={ (e) => handleEdit(e, row)}>
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

            <MenuModal show={showMenu} close={() => setShowMenu(false)} menuEdit={menuEdit} setMenuEdit={setMenuEdit}/>
        </>
        
    )
}
