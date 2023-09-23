import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../auth/authContext';
import { useFetch } from '../../../hooks/useFetch';
import { types } from '../../../types/types';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Container, NavDropdown } from "react-bootstrap";
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

    //expanded={expanded} en expand="lg"
    return ( 
        <>

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='lg ps-3'>
            {/* <Container> */}
            <Navbar.Brand as={Link} to="dashboard" >Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ml-auto">
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

          
                <Nav className="ms-auto">
                    <Nav.Item className="ms-auto">
                        <span className='nav-item nav-link text-info'>
                                {user.user}
                        </span>
                    </Nav.Item>

                    <Nav.Item className="ms-auto">
                        <button 
                                className="nav-item nav-link btn" 
                                onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>

                
                {/* </Container> */}
            </Navbar>
        </>
    )
}

export default NavSidebar;