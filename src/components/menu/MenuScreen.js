import React, { useContext, useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { environment } from '../../environment/environment.dev';
import { MenuTable } from './MenuTable';
import { MenuAddModal } from './MenuAddModal';
import { AuthContext } from '../../auth/authContext';
const endpoint = environment.UrlApiMenu;

const MenuScreen = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [ state, fetchData ] =  useFetch(endpoint);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchData(endpoint, user.token);
    console.log(state);
  }, [fetchData]);

  if(state.loading) { return }
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

export default MenuScreen;
