import {Suspense, lazy} from 'react';
import { Route, Routes} from 'react-router-dom';
import { AutorScreen } from '../components/autor/AutorScreen';
import { DashboardScreen } from '../components/dashboard/DashboardScreen';
import { MenuScreen } from '../components/menu/MenuScreen';
import { PerfilScreen } from '../components/perfil/PerfilScreen';
import { Loader } from '../components/ui/loader/Loader';
const LazyNavSidebar = lazy(() => import('../components/ui/nav/NavSidebar'));
const LazyMenuScreen = lazy(() => import('../components/menu/MenuScreen'));

export const DashboardRoutes = () => {
  return (
    <>
        <Suspense fallback={<Loader />}>
          <LazyNavSidebar />
        </Suspense> 

        <div className='container'>
          <Routes>
            <Route path='dashboard' element={ <DashboardScreen /> } />
            <Route path='menu' element={ <Suspense fallback={<Loader />}> 
                                            <LazyMenuScreen />
                                          </Suspense> } />
            <Route path='autor' element={ <AutorScreen /> } />
            <Route path='perfil' element={ <PerfilScreen /> } />

            <Route path='/' element={ <DashboardScreen />} />
          </Routes>
        </div>
    </>
  )
}
