import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { environment } from '../../environment/environment.dev';
import CryptoJS from 'crypto-js';

var urlValidarTicket = environment.UrlValidarAccesoTicket;

export const LecturaTickets = () => {
    const [decryptedText, setDecryptedText] = useState('');

    const key = "claveAESparaDerivar";
    const iv = "claveAESparaDerivar";

    const decrypAES = (cipherTextBase64, key) => {
        const sha256Key = CryptoJS.SHA256(key);
        const keyBytes = CryptoJS.enc.Hex.parse(sha256Key.toString(CryptoJS.enc.Hex)); // Convertir la clave a bytes

        const ivBytes = CryptoJS.enc.Hex.parse(sha256Key.toString(CryptoJS.enc.Hex).substr(0, 32)); // Usamos los primeros 16 bytes de la clave SHA256 como IV

        const decrypted = CryptoJS.AES.decrypt(cipherTextBase64, keyBytes, {
            iv: ivBytes,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    const formik = useFormik({
        initialValues: {
            dataJson: ""
        },
        onSubmit: async (values) => {
            console.log(values.dataJson)
            const decryptado = decrypAES(values.dataJson, key, iv);
            console.log(decryptado)

           //{"IdTicket": 30032, "RutUsuario": "17520926-3"}
            let jsonParam = JSON.parse(decryptado);
            let rutDv = jsonParam.RutUsuario.split('-');
            let rut = rutDv[0];
            let dv = rutDv[1];
           
            let accesoEventoTicket = {
                idTicket: jsonParam.IdTicket,
                rut: rut,
                dv: dv
            };

            let response = await axios.post(urlValidarTicket, accesoEventoTicket, {
                // headers: {
                //     Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                // },
            });

            console.log(response.data)

          
            formik.resetForm();
        },
    });

    return (
        <div className='row mt-5'>
            <div className='d-flex justify-content-between'>
                <h1>Identificación de Tickets</h1>
            </div>
            <hr/>

            <div>
                <form className="container animate__animated animate__fadeIn"  onSubmit={formik.handleSubmit} >
                    <div className='row'>
                        <div className='col-lg-8'>
                            <label>N° Ticket</label>
                            <input 
                                type="text" 
                                placeholder="Ticket" 
                                className="form-control" 
                                onChange={formik.handleChange} 
                                name="dataJson"
                                defaultValue={formik.values.dataJson} 
                                // disabled
                            
                            />
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}
