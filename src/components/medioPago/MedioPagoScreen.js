import React, { useState } from 'react'
import { MedioPagoTable } from './MedioPagoTable';
import { MedioPagoAddModal } from './MedioPagoAddModal';

export const MedioPagoScreen = () => {
    const [ showAddModal, setShowAddModal ] = useState(false);

    const handleAdd = () => {
        setShowAddModal(true);
    }

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Medios de Pago Screen</h1>
                <div className="p-2">
                    <button className='btn btn-success' onClick={handleAdd}>Nuevo</button>
                </div>
            </div>

            <hr/>
            <MedioPagoTable changeAddForm={showAddModal}/>
            <MedioPagoAddModal show={showAddModal} close={() => setShowAddModal(false)} />
        </div>
        
    )
}
