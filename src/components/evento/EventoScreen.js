import { useState } from "react";
import { EventoTable } from "./EventoTable";
import { EventoAddModal } from "./EventoAddModal";

export const EventoScreen = () => {
    const [ showAddModal, setShowAddModal ] = useState(false);

    const handleAdd = () => {
      setShowAddModal(true);
    }

    return (
      <div className='row mt-5'>
          <div className='d-flex justify-content-between'>
            <h1>Evento Screen</h1>
            <div className="p-2">
              <button className='btn btn-success' onClick={handleAdd}>Nuevo</button>
            </div>
          </div>

        <hr/>
         <EventoTable changeAddForm={showAddModal}/>

        <EventoAddModal show={showAddModal} close={() => setShowAddModal(false)} />
      </div>
    )
}
