import React from 'react'
import { Modal } from 'react-bootstrap'

export const ReferencialMapModal = ({show, close, referencialMap}) => {
    return (
        <Modal
            show={show}
            onHide={close}
        >
            <Modal.Header closeButton>
                <Modal.Title>Mapa Referencial</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <img src={`data:image/jpeg;base64,${referencialMap}`}  style = {{width:"100%", height:"100%", }} />
            </Modal.Body>

            <Modal.Footer>
                <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
            </Modal.Footer>
        </Modal>
    )
}
