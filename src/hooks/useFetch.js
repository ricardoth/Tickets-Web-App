import { useState, useEffect, useRef } from 'react';


export const useFetch = ( url ) => {
    
    const isMounted = useRef(true);
    const [state, setState] = useState({ data: null, loading: true, error: null });

    useEffect( () => {
        return () => {
            isMounted.current = false;
        }
    }, [])


    useEffect( () => {

        setState({ data: null, loading: true, error: null });

        fetch( url )
            .then( resp => resp.json() )
            .then( source => {
                if ( isMounted.current ) {
                    setState({
                        loading: false,
                        error: null,
                        source
                    });
                }

            })
            .catch( () => {
                setState({
                    source: null,
                    loading: false,
                    error: 'No se pudo cargar la info'
                })
            })

    },[url])
    return state;
}