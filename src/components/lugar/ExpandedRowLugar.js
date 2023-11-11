import React from 'react'
import DataTable from 'react-data-table-component';

export const ExpandedRowLugar = ({data}) => {
    const columns = [
        { name: 'Comuna', selector: row => row.comuna.nombreComuna, sortable: true },
        { name: 'Región', selector: row => row.comuna.region.nombreRegion , sortable: true },
        { name: 'N° Región', selector: row => row.comuna.region.abreviatura, sortable: true },
    ];

    const detailData = [data];

    return (
        <DataTable 
            columns={columns}
            data={detailData}
            dense
        />
    )
}
