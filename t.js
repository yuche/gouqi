const crypto = require('crypto');
const bigInt = require('big-integer')
var NodeRSA = require('node-rsa');

const decipher = crypto.createDecipher('AES-128-CBC', '1234567890123456', '0102030405060708');

// var decrypted = '';
// decipher.on('readable', () => {
//   var data = decipher.read();
//   if (data)
//     decrypted += data.toString('utf8');
// });
// decipher.on('end', () => {
//   console.log(decrypted);
//   // Prints: some clear text data
// });

// var encrypted = 'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
// decipher.write(encrypted, 'hex');
// decipher.end();

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

function aesEncrypt(text, secKey) {
    var cipher = crypto.createCipheriv('AES-128-CBC', '1234567890123456', '0102030405060708');
    cipher.update(text, 'utf-8', 'base64');
    return cipher.final('base64');
}

function addPadding(encText, modulus) {
    let ml = modulus.length
    for (let i = 0; ml > 0 && modulus[i] === '0'; i++) {
      ml--
    }
    let num = ml - encText.length, prefix = ''
    for (let i = 0; i < num; i++) {
        prefix += '0'
    }
    return prefix + encText
}

function rsaEncrypt(text, exponent, modulus) {
    var rText = text, radix = 16;
    // for (var i = text.length - 1; i >= 0; i--) rText += text[i];//reverse text
    var biText = bigInt(new Buffer(rText).toString('hex'), radix),
        biEx = bigInt(exponent, radix),
        biMod = bigInt(modulus, radix),
        biRet = biText.modPow(biEx, biMod);
    // console.log(biRet)
    return addPadding(biRet.toString(radix), modulus);
}


console.log(rsaEncrypt('4321',
  '010001',
  '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
))

let fuckk = new NodeRSA();
fuckk.importKey({
  e: 010001,
  n: new Buffer('00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7', 'hex')
})

console.log(fuckk.encrypt('4321', 'hex'))