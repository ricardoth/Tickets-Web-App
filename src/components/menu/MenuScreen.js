import React from 'react'
import { useFetch } from '../../hooks/useFetch';
import { environment } from '../../environment/environment.dev';
import { MenuTable } from './MenuTable'

const endpoint = environment.UrlApiMenu;

export const MenuScreen = () => {
  const { source, loading } =  useFetch(endpoint);
  
  if(loading) { return (<div>Loading...</div>)}

  const {data} = source; 

  return (
    <div className='row mt-5'>
        <h1>MenuScreen</h1>
        <hr/>
        <MenuTable data={data}/>
      
    </div>
  )
}
