export const parserUsuario = json => 
    json.map(({ nombres, apellidoP, apellidoM, idUsuario }) => ({
        label: nombres +' '+ apellidoP + ' '+ apellidoM,value: idUsuario }));

export const parserEvento = json => 
json.map(({ nombreEvento, idEvento }) => ({
    label: nombreEvento, value: idEvento }));

export const parserSector = json => 
json.map(({ nombreSector, idSector }) => ({
    label: nombreSector, value: idSector }));

export const parserMedioPago = json => 
json.map(({ nombreMedioPago, descripcion, idMedioPago }) => ({
    label: nombreMedioPago + " " + descripcion, value: idMedioPago }));

export const parserLugar = json => 
json.map(({ nombreLugar, idLugar }) => ({
    label: nombreLugar, value: idLugar }));

export const parserTipoUsuario = json => 
json.map(({ nombreTipoUsuario, idTipoUsuario }) => ({
    label: nombreTipoUsuario, value: idTipoUsuario }));
    
export const parserRegion = json => 
json.map(({ nombreRegion, idRegion }) => ({
    label: nombreRegion, value: idRegion }));

export const parserComuna = json => 
json.map(({ nombreComuna, idComuna }) => ({
    label: nombreComuna, value: idComuna }));
    