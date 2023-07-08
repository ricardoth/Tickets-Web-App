import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { basicAuth } from '../../types/basicAuth';
import { Buffer } from 'buffer';
import { environment } from '../../environment/environment.dev';
import { Loader } from '../ui/loader/Loader';

const userBasicAuth = basicAuth.username;
const passBasicAuth = basicAuth.password;
const URL_TICKET = environment.UrlGeneracionTicket;

export const TicketControlPanel = () => {
    const [ tickets, setTickets ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {

        setLoading(true);
        let response = axios.get(URL_TICKET, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
            },
        });

        response.then(res => {
            let datos = res.data;

            setTickets(datos);
 
            console.log(datos)
            setLoading(false);
        })
        .catch( err => console.log(err));
    }, []);

    useEffect(() => {
        console.log(tickets)
        
    }, [tickets]);
    
    

    return (
        <div className='row mt-5'>
             <div className='d-flex justify-content-between'>
                <h1>Gestión de Tickets</h1>
            </div>
            <hr/>
            
            <ul>
            {
                loading ? <Loader /> : 
                tickets.map((row) => (

                    <li>AA {JSON.stringify(row)}</li>
                ))
            }
            </ul>
        </div>
        
    )
}
