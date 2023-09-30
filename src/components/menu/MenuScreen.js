import React, { useContext, useEffect, useState } from 'react'
import { environment } from '../../environment/environment.dev';
import { MenuTable } from './MenuTable';
import { MenuAddModal } from './MenuAddModal';
import { AuthContext } from '../../auth/authContext';
import axios from 'axios';
import { Loader } from '../ui/loader/Loader';

const endpoint = environment.UrlApiMenu;

const MenuScreen = () => {
    const { user } = useContext(AuthContext);
    const [ showMenu, setShowMenu ] = useState(false);
    const [ page, setPage ] = useState(1);
    const [ menus, setMenus ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const fetchMenus = async (page) => {  
        setLoading(true);
          await axios.get(endpoint + `${`?PageSize=10&PageNumber=${page}`}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          })
          .then(({data}) => {
              setMenus(data);
              setLoading(false);
          })
          .catch(err => {
              console.error("Ha ocurrido un error al realizar la Petición a API", err);
          })
    }

  const handleAdd = () => {
      setShowMenu(true);
  } 

  useEffect(() => {
    fetchMenus(page);
  }, []);

  return (
    <div className='row mt-5'>
        <div className='d-flex justify-content-between'>
          <h1>MenuScreen</h1>
          <div className="p-2">
            <button className='btn btn-success' onClick={handleAdd}>Nuevo</button>
          </div>
        </div>

        <hr/>
        { loading ? <Loader /> : <MenuTable menus={menus} setMenus={setMenus} page={page} setPage={setPage}/> }
         

        <MenuAddModal show={showMenu} close={() => setShowMenu(false)} setMenus={fetchMenus} />  
    </div>
  )
}

export default MenuScreen;
