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

// Reduce el tamaño de una imagen (lado máximo y calidad JPEG) y devuelve el base64 sin prefijo data:
export const resizeImageToBase64 = (file, maxSize = 1600, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality).replace(/^data:image\/jpeg;base64,/, ''));
        };
        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        };
        img.src = url;
    });
}
