import React from 'react'
import { environment } from '../../environment/environment.dev';
import { useFetch } from '../../hooks/useFetch'

export const AutorScreen = () => {
  const endpoint = environment.UrlApiAutores;

  const { source, loading } =  useFetch(endpoint);
  
  if (loading) {return `Loading`}

  const { data } = source;

  return (
    <div className='row mt-5'>
        <h1>AutorScreen</h1>
        
        <hr/>
        
        {
            loading 
            ?
                (
                    <div className='alert alert-info text-center'>
                        Loading...
                    </div>
                )
            : 
                (
                    data.map(x => (
                        <div  key={x.idAutor} className="card">
                            <div className="card-body">
                            <h2 className="card-title">{x.nombreAutor + ' ' + x.apellidoPatAutor + ' ' + x.apellidoMatAutor}</h2>
                            
                            </div>
                      </div>
                    ))
                )
        }
    </div>
  )
}
