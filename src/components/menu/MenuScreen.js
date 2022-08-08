import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { environment } from '../../environment/environment.dev';
import { MenuTable } from './MenuTable';
import { MenuAddModal } from './MenuAddModal';
const endpoint = environment.UrlApiMenu;

export const MenuScreen = () => {
  const [ state, fetchData ] =  useFetch(endpoint);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchData(endpoint);
  }, [fetchData]);

  if(state.loading) { return (<div>Loading...</div>)}
  const {data} = state.source; 

  const handleAdd = () => {
    setShowMenu(true);
  }

  return (
    <div className='row mt-5'>
        <div className='d-flex justify-content-between'>
          <h1>MenuScreen</h1>
          <div className="p-2">
            <button className='btn btn-success' onClick={handleAdd}>Nuevo</button>
          </div>
        </div>

        <hr/>
        <MenuTable menus={data} setMenus={fetchData}/>

        <MenuAddModal show={showMenu} close={() => setShowMenu(false)} setMenus={fetchData} />
    </div>
  )
}
