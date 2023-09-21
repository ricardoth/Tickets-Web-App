import CryptoJS from 'crypto-js';

export const decrypAES = (cipherTextBase64, key) => {
    const sha256Key = CryptoJS.SHA256(key);
    const keyBytes = CryptoJS.enc.Hex.parse(sha256Key.toString(CryptoJS.enc.Hex)); 

    const ivBytes = CryptoJS.enc.Hex.parse(sha256Key.toString(CryptoJS.enc.Hex).substring(0, 32)); 

    const decrypted = CryptoJS.AES.decrypt(cipherTextBase64, keyBytes, {
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}