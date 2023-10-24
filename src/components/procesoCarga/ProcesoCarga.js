import React, { useState } from 'react';
import { LoadFileModal } from '../loadFileModal/LoadFileModal';

export const ProcesoCarga = () => {
    const [ show, setShow] = useState(false);

    const upModalFile = () => setShow(true);

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Proceso de Carga</h1>
            </div>
            <hr/>
            <div className='row'>
                <div className='col-lg-3'>
                    <button type='button' className='btn btn-primary' onClick={upModalFile}>Subir Archivo</button>
                </div>
            </div>

            <LoadFileModal show={show} close={() => setShow(false)} />
        </div>
    )
}
