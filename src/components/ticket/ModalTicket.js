import React from 'react';
import { Modal } from 'react-bootstrap';

export const ModalTicket = ({ isOpen, closeModal, base64Pdf}) => {
    if (!isOpen) {
        return null;
    }
    
    return (
        <>
           <Modal
                size="xl"
                fullscreen="true"
                show={isOpen}
                onHide={closeModal}
                aria-labelledby="example-modal-sizes-title-lg"
            >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
                Comprobante
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <figure>
                    <object 
                        data  = {`data:application/pdf;base64,${base64Pdf}`} 
                        style = {{width:"98%", height:"550px", }} 

                        type  = "application/pdf">
                    </object>
                </figure>       
            </Modal.Body>
            <Modal.Footer>
                <button onClick={closeModal} className="btn btn-danger">Cerrar</button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
