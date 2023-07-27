import React, { useEffect, useState } from 'react';

export const CardCountTicket = ({ sectorValue, counter, increment, decrement, total, setTotal}) => {
    const [ isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
       setIsDisabled(false);
    }, [counter]);
    

    const addTicketCounter = (e) => {
        setTotal('montoPago', counter * sectorValue.precio)
        setIsDisabled(true);
    }

    const divClassButton = `btn btn-success ${isDisabled ? 'disabled': ''}`;

    return (
        <>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row align-items-center mt-2 d-none d-sm-flex">
                        <div className="col-sm-12">
                            <h6>Para elegir la cantidad de entradas, puedes seleccionarlas aquí</h6>
                        </div>
                    <div className="col-12 col-sm-7 col-md-8 mt-3 mb-3">
                        <div className="row justify-content-between">
                            <div className="col-6 col-sm-4 text-uppercase fw-bold">Ticket</div>
                            <div className="col-12 col-sm-4 price text-uppercase fw-bold">Precio</div>
                        </div>
                    </div>
                    <div className="col-sm-4 mt-3 mb-3 text-uppercase text-center fw-bold">
                        Selecciona Cantidad
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <div className="col-12 col-sm-7 col-md-8">
                        <div className="row justify-content-between">
                            <div className="col-auto col-sm-4"> {sectorValue.nombreSector} </div>
                            <div className="col-auto col-sm-4 price">${sectorValue.precio} </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-5 col-md-4 pt-0">
                        <div className="campos--form pt-0">
                            <div className="d-flex flex-row justify-content-center">
                                <div className="flex-fill" onClick={() => decrement(1)}>
                                    <i className="bi bi-dash-circle-fill"></i>
                                </div>
                                <div className="flex-fill">
                                    { counter }
                                </div>
                                <div className="flex-fill" onClick={() => increment(1)}>
                                    <i className="bi bi-plus-circle-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                   
                <div className="row my-3">
                    <div className="col-12 text-end text-md-right">
                        <div className="w-100">
                            <div className={divClassButton} onClick={addTicketCounter}>Agregar</div>
                        </div>
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col-12 text-end text-md-right">
                        <p className='fw-bold'>Total: ${total} </p>
                    </div>
                </div>
            </div>
        </>
    )
}
