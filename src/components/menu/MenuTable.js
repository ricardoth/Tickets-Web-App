import React, { useState } from 'react';
// import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component'; 
import { FaTrashAlt, FaCheck, FaTimes, FaPen } from 'react-icons/fa';
import Swal from 'sweetalert2';

export const MenuTable = ({data}) => {
    const [menus, setMenus] = useState(data);

    const handleDelete = (idMenu) => {
        Swal.fire({
            title: 'Atención',
            text: '¿Desea eliminar el menú?',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })

        const temp = [...menus];
        const index = temp.findIndex(x => x.idMenu === idMenu);
        temp.splice(index, 1);
        setMenus(temp);
    }
    
    const handleEdit = (idMenu, menu) => {
        Swal.fire({
            title: 'Atención',
            text: '¿Desea editar el menú?',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          })

        let temp = [...menus];
        const index = temp.findIndex(x => x.idMenu === idMenu);
        var o = temp[index];
        o.nombre= "Master Data PAge";
        setMenus(temp);
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
                    <button className='btn btn-danger' onClick={ () => handleDelete(row.idMenu)}>
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
    console.log(menus);

    return (
        <DataTable
            title="Menús"
            columns={columns}
            data={menus}
            pagination
            responsive
            defaultSortAsc={true}
        />
    )
}
