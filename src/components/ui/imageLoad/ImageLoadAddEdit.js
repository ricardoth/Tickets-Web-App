import { isValidBase64 } from "../../../selectors/validarBase64"

export const ImageLoadAddEdit = ({image}) => {
    const isBase64 = isValidBase64(image);

    return (
       isBase64 === true ? 
       <img src={`data:image/jpg;base64,${image}`} style = {{width:"80%", height:"80%"}} alt="Imagen"  />
       :
       <img src={`${image}`}  style = {{width:"80%", height:"80%"}} alt="Imagen"  />
    )
}
