import { useState } from "react";
import { Loader } from "../ui/loader/Loader"
import { UsuarioTable } from "./UsuarioTable"
import { UsuarioAddModal } from "./UsuarioAddModal";

export const UsuarioScreen = () => {
    const [ showAddModal, setShowAddModal ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const handleAdd = () => {
        setShowAddModal(true);
    }

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Usuario Ticket Screen</h1>
                <div className="p-2">
                    <button className='btn btn-success' onClick={handleAdd}>Nuevo</button>
                </div>
            </div>
            <hr/>
            { loading ? <Loader /> : <UsuarioTable changeAddForm={showAddModal} /> }

            <UsuarioAddModal show={showAddModal} close={() => setShowAddModal(false) } />
      </div>
    )
}
