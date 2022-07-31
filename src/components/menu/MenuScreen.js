import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { environment } from '../../environment/environment.dev';
import { MenuTable } from './MenuTable'

const endpoint = environment.UrlApiMenu;

export const MenuScreen = () => {
  const [state, fetchData ] =  useFetch(endpoint);

  useEffect(() => {
    fetchData(endpoint)
  }, [fetchData]);

  if(state.loading) { return (<div>Loading...</div>)}
  const {data} = state.source; 
  
  return (
    
    <div className='row mt-5'>
        <h1>MenuScreen</h1>
        <hr/>
        <MenuTable menus={data} setMenus={fetchData}/>
    </div>
  )
}
