import { useState } from "react"
import { LugarTable } from "./LugarTable"
import { LugarAddModal } from "./LugarAddModal";

export const LugarScreen = () => {
    const [ showAddModal, setShowAddModal ] = useState(false);

    const handleAdd = () => {
        setShowAddModal(true);
    }

    return (
        <div className='row mt-5'> 
            <div className='d-flex justify-content-between'>
                <h1>Lugar Screen</h1>
                <div className="p-2">
                    <button className='btn btn-success' onClick={handleAdd}>Nuevo</button>
                </div>
            </div>
            <hr/>

            <LugarTable  changeAddForm={showAddModal} />

            <LugarAddModal show={showAddModal} close={() => setShowAddModal(false)}/>
        </div>
    )
}
