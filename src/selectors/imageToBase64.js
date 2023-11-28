export const convertImageToBase64 = async (url) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); 
            reader.onerror = reject;
            reader.readAsDataURL(blob); 
        });
    } catch (error) {
        console.log('Error al convertir la imagen a base64: ',error)
        return null;
    }
}


export const formattedImageBase64 = (base64String) => {
    let cleanBase64 = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    return cleanBase64;
}