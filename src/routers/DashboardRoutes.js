import { Route, Routes} from 'react-router-dom';
import { AutorScreen } from '../components/autor/AutorScreen';
import { DashboardScreen } from '../components/dashboard/DashboardScreen';
import { MenuScreen } from '../components/menu/MenuScreen';
import { PerfilScreen } from '../components/perfil/PerfilScreen';
import { NavSidebar } from '../components/ui/NavSidebar';

export const DashboardRoutes = () => {
  return (
    <>
        <NavSidebar />
        <div className='container'>
          <Routes>
            <Route path='dashboard' element={ <DashboardScreen /> } />
            <Route path='menu' element={ <MenuScreen /> } />
            <Route path='autor' element={ <AutorScreen /> } />
            <Route path='perfil' element={ <PerfilScreen /> } />

            <Route path='/' element={ <MenuScreen />} />
          </Routes>
        </div>
    </>
  )
}
