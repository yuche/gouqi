const aesjs = require('aes-js')
const crypto = require('browserify-aes')

function aesEncrypt(text, secKey) {
    const cipher = crypto.createCipheriv('AES-128-CBC', secKey, '0102030405060708')
    return cipher.update(text, 'utf8', 'base64') + cipher.final('base64')
}

function createSecretKey(size) {
    var keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var key = "";
    for (var i = 0; i < size; i++) {
        var pos = Math.random() * keys.length;
        pos = Math.floor(pos);
        key = key + keys.charAt(pos)
    }
    return key;
}

function encry (text, secKey) {
    const aesCbc = new aesjs.ModeOfOperation.cbc(secKey, '0102030405060708')
    return aesCbc.encrypt(aesjs.util.convertStringToBytes(text))
}

const key = createSecretKey(16)

const text = 'TextMustBe16Byte'

console.log('corrent:')
console.log(aesEncrypt(text, key))

// console.log(encry(text, key))
