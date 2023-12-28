import { Modal } from "react-bootstrap"

export const BannerModal = ({show, close, banner}) => {
    return (
        <Modal
            show={show}
            onHide={close}
        >
            <Modal.Header closeButton>
                    <Modal.Title>Banner Medio de Pago</Modal.Title>
                </Modal.Header>
            <Modal.Body>
                <img src={`${banner}`}  style = {{width:"100%", height:"100%", }} />
            </Modal.Body>

            <Modal.Footer>
                <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
            </Modal.Footer>
        </Modal>
    )
}