import React from 'react'

export const ImageFlyer = ({image, isVisible}) => {

    return (
       <img hidden={isVisible} src={`${image}`} className="img-fluid img-thumbnail" alt="Imagen"  style={{width:"100%", height:"100%",}}  />
    )
}
