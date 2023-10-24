import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';

export const UsuarioAddModal = ({show, close}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        formik.resetForm();
    }, []);

    const formik = useFormik({
        initialValues: {

        },
        validationSchema: '',
        onSubmit: async (values) => {
            console.log(values)
        } 
    });

    return (
        <>
            <Modal
                show={show}
                onHide={close}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Usuario</Modal.Title>
                </Modal.Header>

                <form className="container animate__animated animate__fadeIn" onSubmit={formik.handleSubmit}>
                    <Modal.Body>

                    </Modal.Body>


                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary">Aceptar</button>
                        <button className="btn btn-danger" onClick={close} type="button" data-dismiss="modal">Cerrar</button>
                    </Modal.Footer>
                </form>
                
            </Modal>
        
        </>
    )
}
