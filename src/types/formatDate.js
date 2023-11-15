
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

export const formatDateHourEventTicket = (paramDate) => {
    const eventDate = new Date(paramDate);
    const hourDate = paramDate.split('T');
    const horaEvento = hourDate[1].split(':');
    const horaUno = horaEvento[0];
    const minutosEvento = horaEvento[1];
    
    const yearEvent = eventDate.getFullYear();
    const monthEvent = (eventDate.getMonth() + 1).toString().padStart(2, '0');
    const dayEvent = eventDate.getDate().toString().padStart(2, '0');

    const dateString = `${yearEvent}-${monthEvent}-${dayEvent}T${horaUno}:${minutosEvento}`;
    return dateString;
}