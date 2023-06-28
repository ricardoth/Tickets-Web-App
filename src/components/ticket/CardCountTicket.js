import React from 'react'

export const CardCountTicket = () => {
  return (
    <>
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 entradas-numeradas">
            <div className="row align-items-center mt-2 d-none d-sm-flex">
                    <div className="col-sm-12">
                        <h6>Para elegir la cantidad de entradas, puedes seleccionarlas aquí</h6>
                    </div>
                <div className="col-12 col-sm-7 col-md-8 mt-3 mb-3">
                    <div className="row justify-content-between">
                        <div className="col-6 col-sm-4 text-uppercase table-head-seleccion fw-bold">Ticket</div>
                        <div className="col-12 col-sm-4 price text-uppercase table-head-seleccion fw-bold">Precio</div>
                    </div>
                </div>
                <div className="col-sm-4 mt-3 mb-3 text-uppercase text-center table-head-seleccion fw-bold">
                    Selecciona Cantidad
                </div>
            </div>
                <div className="row align-items-center mt-2">
                    <div className="col-12 col-sm-7 col-md-8">
                        <div className="row justify-content-between">
                            <div className="col-auto col-sm-4"> GALERIA </div>
                            <div className="col-auto col-sm-4 price">$33.350 </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-5 col-md-4 campos--form pt-0">
                        <div className="campos--form pt-0">
                            <div className="d-flex flex-row align-items-center justify-content-center campos--cantidad">
                                <div className="flex-fill align-self-center btn--form btn--menos" onclick="restarTicketPorId(7);">
                                    <i className="bi bi-minus-circle-fill"></i>
                                </div>
                                <div className="flex-fill align-self-center show--cantidad CantidadTickets cantidad-tickets-id-7">
                                    0
                                </div>
                                <input type="hidden" value="0" id="select-cantidad-nonum" />
                                <div className="flex-fill align-self-center btn--form btn--mas" onclick="agregarTicketPorId(7);">
                                    <i className="bi bi-plus-circle-fill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row align-items-center mt-2">
                    <div className="col-12 col-sm-7 col-md-8">
                        <div className="row justify-content-between">
                            <div className="col-auto col-sm-4"> SILLA DE RUEDAS  </div>
                            <div className="col-auto col-sm-4 price">$39.900 </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-5 col-md-4 campos--form pt-0">
                        <div className="campos--form pt-0">
                            <div className="d-flex flex-row align-items-center justify-content-center campos--cantidad">
                                <div className="flex-fill align-self-center btn--form btn--menos" onclick="restarTicketPorId(8);">
                                    <i className="flaticon-minus-line"></i>
                                </div>
                                <div className="flex-fill align-self-center show--cantidad CantidadTickets cantidad-tickets-id-8">
                                    0
                                </div>
                                <input type="hidden" value="0" id="select-cantidad-nonum" />
                                <div className="flex-fill align-self-center btn--form btn--mas" onclick="agregarTicketPorId(8);">
                                    <i className="flaticon-plus"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="row my-3">
                <div className="col-12 text-center text-md-right">
                    <div className="block--agregar__btn w-100">
                        <div className="svg hide"></div>
                        <div className="bton--agregar" id="btn-agregar-nonum-lista">Agregar</div>
                    </div>
                </div>
            </div>
        </div>
        </>
  )
}
