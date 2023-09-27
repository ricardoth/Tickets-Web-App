import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { AuthContext } from '../../auth/authContext';

export const LoadFileModal = ({show, close}) => {
    const { user } = useContext(AuthContext);
    const [ excel, setExcel ] = useState();
    
    const prepareFile = async (e) => {
        let [file] = e.target.files;
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bStr = evt.target.result;
            const workBook = XLSX.read(bStr, { type: 'binary'});
            const wsName = workBook.SheetNames[0];
            const ws = workBook.Sheets[wsName];
            const resultado = [];

            const datos = XLSX.utils.sheet_to_json(ws, {
                header: 1,
                blankrows: false,
                range: 1,
                defval: "",
            });
        
            datos.map((value) => {
                if (value[0] === "") {
                    return;
                }

                const row = {
                    IdCliente: parseInt(value[0]),
                    CodigoCliente: value[1],
                    Empresa: value[2],
                    NombreCliente: value[3], 
                    Cargo: value[4],
                    Direccion: value[5],
                    Ciudad: value[6],
                    Region: value[7],
                    CodigoPostal: value[8],
                    Pais: value[9],
                    Telefono: value[10],
                    Fax: value[11]
                }
                resultado.push(row);

            });

            setExcel(resultado);
        }
        reader.readAsBinaryString(file);
    }

    const loadFile = async () => {
        // let processFile = document.getElementById("inputFile").value;
        let excelFields = Object.entries(excel);

        if(excelFields.length === 0)
            return false;

        const result = await axios.post('https://localhost:44383/api/ProcesoCarga',JSON.stringify(excel), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        
        if(result.data) {
            Swal.fire('Proceso de Carga', 'Se ha procesado el documento con éxito!', 'success');
            close();

        } else {
            Swal.fire('Proceso de Carga', 'Ha ocurrido un error al tratar de procesar el archivo!', 'error');
        }
    }

    return (
        <>
            <Modal
                show={show} 
                onHide={close}
            >
                 <Modal.Header closeButton>
                    <Modal.Title>Cargar Archivo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className='row'>

                    <br />
                    <div className='col-lg-12'>
                        <input type="file" id='inputFile' className='form-control' onChange={prepareFile} required/>
                    </div>
                </div>
                </Modal.Body>
                <Modal.Footer>

                    <button type='button' className='btn btn-primary ' onClick={loadFile}>Cargar Archivo</button>
                    <button type='button' className='btn btn-danger' onClick={close}>Cerrar</button>
                </Modal.Footer>
            </Modal>
            
        </>
    )
}
