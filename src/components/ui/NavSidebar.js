import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { useFetch } from '../../hooks/useFetch';
import { types } from '../../types/types';
// import './NavSidebar.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavDropdown } from "react-bootstrap";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";

export const NavSidebar = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    //Se debe colocar en el login cuando ejecuta la accion, se manda el rut y debe traer todos los menues asociados a ese rut
    const endpoint = `https://localhost:44383/api/Menu`;
    const { source, loading } = useFetch(endpoint);

    if (loading) {return `Loading`}

    const { data } = source;

    const padres = data.filter(x => x.padre === 0 && x.esPadre === true)
    const hijos = data.filter(x => x.padre !== 0);
    // const hijosSinNietos = hijos.filter(x => x.esPadre === false);
    const nietos = data.filter(x => x.esPadre === false && x.tieneHijos === false);

    const handleLogout = () => {
        dispatch({ type: types.logout });

        navigate("/login", {
            replace: true
        });
    }

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="dashboard">Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                {
                    

                    padres.map( (menu) => {
                        if(!menu.tieneHijos) {
                            return <Nav.Link as={Link} key={menu.idMenu} to={menu.url}>{menu.nombre}</Nav.Link>;
                        } else {
                            return (
                                <NavDropdownMenu key={menu.idMenu} title={menu.nombre} id="collasible-nav-dropdown">
                                    { 
                                        hijos.map((child) => {
                                            if(child.padre === menu.idMenu) {
                                                if(child.esPadre) {
                                                    return (
                                                        <DropdownSubmenu as={NavLink} key={menu.idMenu} to={menu.url} title={child.nombre}>
                                                            { 
                                                                nietos.map((nieto) => {
                                                                    if(nieto.padre === child.idMenu) {
                                                                        return (
                                                                            <NavDropdown.Item as={NavLink} key={nieto.idMenu} to={nieto.url}>{nieto.nombre}</NavDropdown.Item>
                                                                        );

                                                                    }
                                                                })
                                                            }
                                                        </DropdownSubmenu>
                                                    )
                                                } else {
                                                    return (
                                                        <NavDropdown.Item as={NavLink} key={child.idMenu} to={child.url}>{child.nombre}</NavDropdown.Item>
                                                    )
                                                } 
                                                
                                            } else {
                                                console.log(child)
                                                // return (
                                                //     <NavDropdown.Item key={child.idMenu} href={child.url}>{child.nombre}</NavDropdown.Item>
                                                // )
                                            }

                                          
                                        }) 
                                    }
                                </NavDropdownMenu>
                            )
                        }
                    })
                    
                }
                </Nav>
            </Navbar.Collapse>

            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                    <ul className='navbar-nav ml-auto'>
                        <span className='nav-item nav-link text-info'>
                             {user.name}
                        </span>

                        <button 
                             className="nav-item nav-link btn" 
                             onClick={handleLogout}
                        >
                           Logout
                        </button>
                    </ul>
                 </div>
            </Navbar>
        </>
    )
}
