import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

// Convierte base64 (con o sin prefijo data:) en un Blob PDF.
// Los data: URI grandes (varios MB) no cargan de forma confiable en <object>/<iframe>,
// por eso se usa una URL de objeto.
const base64ToPdfBlob = (base64) => {
    const clean = String(base64 || '')
        .replace(/^"|"$/g, '')
        .replace(/^data:application\/pdf;base64,/, '')
        .replace(/\s/g, '');
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: 'application/pdf' });
};

export const ModalTicket = ({ isOpen, closeModal, base64Pdf}) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (!isOpen || !base64Pdf) {
            setPdfUrl(null);
            return undefined;
        }
        let url = null;
        try {
            url = URL.createObjectURL(base64ToPdfBlob(base64Pdf));
            setPdfUrl(url);
        } catch (error) {
            console.error('No se pudo decodificar el PDF:', error);
            setPdfUrl(null);
        }
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [isOpen, base64Pdf]);

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
                {pdfUrl ? (
                    <figure>
                        <object
                            data  = {pdfUrl}
                            style = {{width:"98%", height:"550px", }}
                            type  = "application/pdf">
                            <a href={pdfUrl} download="tickets.pdf">Descargar PDF</a>
                        </object>
                    </figure>
                ) : (
                    <p>No se pudo mostrar el comprobante.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button onClick={closeModal} className="btn btn-danger">Cerrar</button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
