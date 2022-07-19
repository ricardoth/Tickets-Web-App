import React from 'react'
import { useFetch } from '../../hooks/useFetch'

export const AutorScreen = () => {
  const { source, loading } =  useFetch("https://localhost:7190/api/Autor");
  

  if (loading) {return `Loading`}

  const { data } = source;

  console.log(data);
   
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
