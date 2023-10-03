import React, { useContext, useEffect ,useState} from 'react'
import {Buffer} from 'buffer';
import { AuthContext } from '../../../auth/authContext';
import { environment } from '../../../environment/environment.dev';

const basicAuthType = environment.BasicAuthType;
const jwtAuthType = environment.JWTAuthType;
const basicAuth = {
    username: environment.UserBasicAuth,
    password: environment.PasswordBasicAuth
};

export const Combobox = ({ id, value, setValue, url, parser, tipoAuth}) => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([{label: "loading", value: "loading"}]);

    const onChange = (event) => {
        setValue(event);
    }

    useEffect(() => {
        let unmounted = false;
        let headerAuth = null;

        if (tipoAuth === jwtAuthType) {
            headerAuth = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        }  else if (tipoAuth === basicAuthType){

            headerAuth = {
                Authorization: `Basic ${Buffer.from(`${basicAuth.username}:${basicAuth.password}`).toString('base64')}`,
            };
        }

        async function getCharacters() {
          const response = await fetch(url, {
            headers: headerAuth
          });
          const { data } = await response.json();
          if (!unmounted) {
            const active = data.some(o => 'activo' in o);
            const isActive = data.some(o => 'esActivo' in o);
        
            if(active) {
                let listActives = data.filter((row) => {
                    if(row.activo) {
                        return row;
                    }
                });
                setItems(parser(listActives));
            }
            
            if(isActive) {
                let listIsActives = data.filter((row) => {
                    if(row.esActivo)
                        return row;
                });
                setItems(parser(listIsActives));
            }
            setLoading(false);
          }
        }
        getCharacters();
        return () => (unmounted = true);
    }, [url])
    

    return (
        <>
            <select
                className="custom-select form-control"
                id={id}
                disabled={loading}
                value={value}
                onChange={onChange}
            >
                <option key={0} value={0}>--- Seleccionar ---</option>
                {items && items.map(({ label, value }) => (
                    <option key={value} value={value}>
                        {value} - {label}
                    </option>
                ))}
            </select>
        </>
    )
}
