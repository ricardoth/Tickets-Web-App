
const opciones = { year: 'numeric', month: 'long', day: '2-digit' };

export const formatDateLocaleString = (paramDate) => {
    let fecha = new Date(paramDate);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones).replace(/\//g, '-');
    return fechaFormateada;
}

export const formatDateDayMonthYear = (paramDate) =>  {
    let fecha = new Date(paramDate);
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0');
    let anio = fecha.getFullYear();

    let horas = String(fecha.getHours()).padStart(2, '0');
    let minutos = String(fecha.getMinutes()).padStart(2, '0');
    let segundos = String(fecha.getSeconds()).padStart(2, '0');

    let fechaFormateada = `${dia}-${mes}-${anio} ${horas}:${minutos}:${segundos}`; // crea la fecha y hora en formato DD-MM-YYYY HH:MM:SS
    return fechaFormateada;

}