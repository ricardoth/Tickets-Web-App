import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NavItemChild = ({menuPadre}) => {
  return (
    <Nav.Link as={Link} to={menuPadre.url}>
        {menuPadre.nombre}
    </Nav.Link>
  )
}
