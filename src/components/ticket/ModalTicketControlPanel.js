import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Loader } from '../ui/loader/Loader'
import { environment } from '../../environment/environment.dev';
import axios from 'axios';
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import { formatDateDayMonthYear, formatDateLocaleString } from '../../types/formatDate';

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;
const URL_TICKET_QR = environment.UrlGetTicketQR;


export const ModalTicketControlPanel = ({isOpen, closeModal, ticketObj}) => {
    const [ base64QRTicket, setBase64QRTicket ] = useState('');
    const [ fecEvento, setFecEvento ] = useState(''); 
    const [ fecTicket, setFecTicket ] = useState('');
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if(ticketObj != undefined) {
            setLoading(true);
            fetchTicketQR(); 
            let auxDateEvent = formatDateLocaleString(ticketObj.evento.fecha);
            let auxDateTicket = formatDateDayMonthYear(ticketObj.fechaTicket);
            setFecEvento(auxDateEvent);
            setFecTicket(auxDateTicket);
            setLoading(false);
        }
    }, [ticketObj]);

    if (ticketObj == undefined) return '';

    const { evento, medioPago, sector, usuario} = ticketObj;
    const { lugar } = evento;
    const { comuna } = lugar;

    const fetchTicketQR = async () => {
        await axios.get(URL_TICKET_QR + `?idTicket=${ticketObj.idTicket}`, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        }).then(res => {
            let datos = res.data;
            let resObj = datos.data;
            setBase64QRTicket(resObj.contenido);
        })
        .catch( err => console.log(err));
    }

    return (
        <>
            <Modal
                size="lg"
                fullscreen="true"
                show={isOpen}
                onHide={closeModal}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Ticket N° { ticketObj.idTicket}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className='container animate__animated animate__fadeIn'>
                        <div className='card'>
                            <div className='card-body'>
                                { 
                                    loading ? <Loader /> : 
                                    <div className='row'>
                                        <div className='col-lg-6'>
                                            <div className="list-group">
                                                <div className='list-group-item list-group-item-action'>
                                                    Ticket N° { ticketObj.idTicket}
                                                </div>
                                                <div className='list-group-item list-group-item-action'>
                                                    Nombre: { usuario.nombres} {usuario.apellidoP} {usuario.apellidoM}
                                                    <br/>
                                                    Rut: {usuario.rut}-{usuario.dv}
                                                    <br/>
                                                    Correo: { usuario.correo}
                                                    <br/>
                                                    Fono: { usuario.telefono}
                                                </div>
                                                <div className='list-group-item list-group-item-action'>
                                                    Evento: { evento.nombreEvento}
                                                    <br/>
                                                    Fecha: {fecEvento}
                                                </div>
                                                <div className='list-group-item list-group-item-action'>
                                                    Sector: { sector.nombreSector}
                                                </div>
                                                <div className='list-group-item list-group-item-action'>
                                                    Lugar: { lugar.nombreLugar } #{lugar.numeracion}
                                                    <br />
                                                    Comuna: {comuna.nombreComuna}
                                                </div>
                                                <div className='list-group-item list-group-item-action'>
                                                    Valor: ${ticketObj.montoTotal}
                                                    <br/>
                                                    Fecha Ticket: {fecTicket} Hrs
                                                </div>
                                            </div>
                                            
                                        </div>

                                        <div className='col-lg-6'>
                                            
                                            <div className="list-group">
                                                <div className='list-group-item list-group-item-action'>
                                                        <img src={`data:image/png;base64,${base64QRTicket}`}  style = {{width:"100%", height:"100%", }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={closeModal} className="btn btn-danger">Cerrar</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
