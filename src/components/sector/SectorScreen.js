import { useState } from "react"
import { SectorTable } from "./SectorTable";
import { Combobox } from "../ui/combobox/Combobox";
import { parserEvento } from "../../types/parsers";
import { environment } from "../../environment/environment.dev";
import { SectorAddModal } from "./SectorAddModal";

const UrlGetEventos = environment.UrlGetEventos;

export const SectorScreen = () => {
    const [ showAddModal, setShowAddModal] = useState(false);
    const [ idEvento, setIdEvento ] = useState(0);

    const handleAdd = () => {
        setShowAddModal(true);
    }

    const handleChangeEvento = ({target}) => {
        setIdEvento(target.value);
    }

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Sector Screen</h1>
                <div className="p-2">
                    <button className='btn btn-success' onClick={handleAdd}>Nuevo</button>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-8">
                    Seleccione un evento para filtrar
                    <Combobox
                        id="idEvento"
                        value={idEvento}
                        setValue={handleChangeEvento}
                        url={UrlGetEventos}
                        parser={parserEvento}
                        tipoAuth={environment.BasicAuthType}
                    /> 

                </div>
                
            </div>


            <SectorTable changeAddForm={showAddModal} idEvento={idEvento}/>
       
            <SectorAddModal show={showAddModal} close={() => setShowAddModal(false)} />

            <hr/>
        </div>
  )
}
