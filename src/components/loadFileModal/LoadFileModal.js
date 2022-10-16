import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import * as XLSX from "xlsx";
import { AuthContext } from '../../auth/authContext';
import { useFetch } from '../../hooks/useFetch';
import { ClienteCarga } from '../../models/interfaces/ClienteCarga.js';

export const LoadFileModal = ({show, close}) => {
    const { user, dispatch } = useContext(AuthContext);
    const [ excel, setExcel ] = useState();
    const [ headerExcel, setHeaderExcel ] = useState();
    const [ state, fetchData ] = useFetch();
    
    const prepareFile = async (e) => {
        let [file] = e.target.files;
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bStr = evt.target.result;
            const workBook = XLSX.read(bStr, { type: 'binary'});
            const wsName = workBook.SheetNames[0];
            const ws = workBook.Sheets[wsName];

            const data = XLSX.utils.sheet_to_json(ws, {
                header: 1,
                blankrows: false,
                range: 1,
                defval: "",  
            });

            const headers = XLSX.utils.sheet_to_json(ws, {
                header: 1,
            });

            // const range = XLSX.utils.decode_range(ws["!ref"]?.toString());
            // console.log(range.e);
            //  range.e = { r:11, c:15 };

            // const dataValidation = XLSX.utils.sheet_to_json(ws, {
            //     range: range,
            //     blankrows: false,
            //     header: 1
            // });
            const resultado = [];

            const datos = XLSX.utils.sheet_to_json(ws, {
                header: 1,
                blankrows: false,
                range: 1,
                defval: "",
            });
        
            datos.map((value, key) => {
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

            const cabecera = headers[0];
            const formatHeader = Object.assign(...cabecera.map(k => ({ [k]: 0})));
            
            setHeaderExcel(formatHeader);
            setExcel(resultado);
        }
        reader.readAsBinaryString(file);
    }

    const loadFile = async () => {
        let processFile = document.getElementById("inputFile").value;
        let excelFields = Object.entries(excel);

        if(excelFields.length === 0)
            return false;

        fetch('https://localhost:44383/api/ProcesoCarga', {
            method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
              },
            body: JSON.stringify(excel)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .catch(err => console.log(err));
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
