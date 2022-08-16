import React, { useEffect } from 'react'
import { useState } from 'react';


export const Combobox = ({ id, value, setValue, url, parser}) => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([{label: "loading", value: "loading"}]);

    const onChange = evt => {
        setValue(evt.currentTarget.value);
    }

    useEffect(() => {
        let unmounted = false;

        async function getCharacters() {
          const response = await fetch(url);
          const {data, meta} = await response.json();
          if (!unmounted) {
            setItems(parser(data));
            setLoading(false);
          }
        }
        getCharacters();
        return () => (unmounted = true);
    }, [url])
    

    return (
        <div className="input-group mb-3">
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
        </div>
    )
}
