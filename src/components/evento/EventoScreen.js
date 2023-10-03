import { useState } from "react";
import { EventoTable } from "./EventoTable";
import { EventoAddModal } from "./EventoAddModal";

export const EventoScreen = () => {
    const [ showMenu, setShowMenu ] = useState(false);

    const handleAdd = () => {
        setShowMenu(true);
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
         <EventoTable changeAddForm={showMenu}/>

        <EventoAddModal show={showMenu} close={() => setShowMenu(false)} />
    </div>
    )
}
