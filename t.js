// const aesjs = require('aes-js')
const crypto = require('browserify-aes')
var CryptoJS = require("crypto-js")
function aesEncrypt(text, secKey) {
    const cipher = crypto.createCipheriv('AES-128-CBC', secKey, '0102030405060708')
    return cipher.update(text, 'utf8', 'base64') + cipher.final('base64')
}

// function createSecretKey(size) {
//     var keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     var key = "";
//     for (var i = 0; i < size; i++) {
//         var pos = Math.random() * keys.length;
//         pos = Math.floor(pos);
//         key = key + keys.charAt(pos)
//     }
//     return key;
// }


var iv = CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f'); 
function aes (text, sec) {
    return CryptoJS.AES.encrypt(text,
        CryptoJS.enc.Utf8.parse(sec),
        {iv: CryptoJS.enc.Utf8.parse('0102030405060708')}
    )
}

// const key = createSecretKey(16)
// console.log(key)
const text = 'fuckyou'

console.log('corrent:')
console.log(aesEncrypt(text, 'fj5thyJ3iP6bMmx4'))
console.log(aes(text, 'fj5thyJ3iP6bMmx4').toString())



// console.log(encry(text, key))
