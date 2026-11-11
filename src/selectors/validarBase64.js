export const isValidBase64 = (strParam) => {
    if (typeof strParam !== 'string' || strParam.length === 0) return false;
    // Una URL o data-uri no es base64 "crudo"
    if (/^(https?:|data:|blob:|\/)/i.test(strParam)) return false;
    // Regex lineal (sin backtracking) para soportar cadenas muy grandes
    return /^[A-Za-z0-9+/]*={0,2}$/.test(strParam) && strParam.length % 4 === 0;
}
