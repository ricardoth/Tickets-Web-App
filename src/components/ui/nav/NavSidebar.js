import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../auth/authContext';
import { useFetch } from '../../../hooks/useFetch';
import { types } from '../../../types/types';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavDropdown } from "react-bootstrap";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";
import { environment } from '../../../environment/environment.dev';
import { NavItemChild } from '../nav/NavItemChild';

const NavSidebar = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const endpoint = environment.urlApiMenuUsuario + '/' + user.rut + '/' + environment.ID_APP;
    const [ state, fetchData ] = useFetch(endpoint);
    const [expanded, setExpanded] = useState(false);
    
    useEffect(() => {
      fetchData(endpoint, user.token )
    }, [fetchData]);

    if (state.loading) {return }

    const { data } = state.source; 
    
    const padres = data.filter(x => x.padre === 0 && x.esPadre === true)
    const hijos = data.filter(x => x.padre !== 0);
    const nietos = data.filter(x => x.esPadre === false && x.tieneHijos === false);

    const handleLogout = () => {
        dispatch({ type: types.logout });

        navigate("/login", {
            replace: true 
        });
    }

    const closeNav = () => {
        setExpanded(false)
    }

    return ( 
        <>
            <Navbar collapseOnSelect expanded={expanded} bg="dark" variant="dark" className='lg ps-3'>
            <Navbar.Brand as={Link} to="dashboard" >Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                {
                    padres.map( (menu) => {
                        if(!menu.tieneHijos) {
                            return <NavItemChild key={menu.idMenu} menuPadre={menu}/>
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
                                                                            <NavDropdown.Item onSelect={closeNav} as={NavLink} key={nieto.idMenu} to={nieto.url}>{nieto.nombre}</NavDropdown.Item>
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
                                {user.user}
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

export default NavSidebar;