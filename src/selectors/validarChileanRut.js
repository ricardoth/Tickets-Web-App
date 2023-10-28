export const validarRutChileno = (paramRutChileno) => {
	//Valida el rut con los siguientes formatos: "XXXXXXXX-X", "XXXXXXXXX" o "XX.XXX.XXX-X"
    if (paramRutChileno === undefined) { return false; }
    if (paramRutChileno.length == 0) { return false; }
    if (paramRutChileno.length < 8) { return false; }
    if (!paramRutChileno.includes('-')) { return false;}

    paramRutChileno = paramRutChileno.replace('-', '')
    paramRutChileno = paramRutChileno.replace(/\./g, '')

    var suma = 0;
    var caracteres = "1234567890kK";
    var contador = 0;
    var u, res, dvi;
    for (var i = 0; i < paramRutChileno.length; i++) {
        u = paramRutChileno.substring(i, i + 1);
        if (caracteres.indexOf(u) != -1)
            contador++;
    }
    if (contador == 0) { return false }

    var rut = paramRutChileno.substring(0, paramRutChileno.length - 1)
    var drut = paramRutChileno.substring(paramRutChileno.length - 1)
    var dvr = '0';
    var mul = 2;

    for (i = rut.length - 1; i >= 0; i--) {
        suma = suma + rut.charAt(i) * mul
        if (mul == 7) mul = 2
        else mul++
    }
    res = suma % 11
    if (res == 1) dvr = 'k'
    else if (res == 0) dvr = '0'
    else {
        dvi = 11 - res
        dvr = dvi + ""
    }
    if (dvr != drut.toLowerCase()) {
        return false;
    }
    else {
        return true;
    }
}