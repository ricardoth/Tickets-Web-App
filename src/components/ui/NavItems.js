import React from 'react'
import { Link } from 'react-router-dom';
import './NavItems.css'

export const NavItems = ({items}) => {
  return (
    <>
    <ul className='nav-submenu'>
    {
        items.map((item) => {
            return (
                <li key={item.idMenu}>
                    <Link 
                        to={item.url}
                        className='nav-item'
                    >
                        {item.nombre}
                    </Link>
                </li>
            );
        })
    }
    </ul>
    </>
  )
}
