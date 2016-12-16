/**
 * Created by weijianli on 16/12/14.
 */
var crypto = require('crypto');

//var data = "156156165152165156156";
var algorithm = 'aes-128-ecb';
//var key = '78541561566';
var clearEncoding = 'utf8';
//var cipherEncoding = 'hex';
//If the next line is uncommented, the final cleartext is wrong.
var cipherEncoding = 'base64';


function AESFun(data, key) {


  console.log('Original cleartext: ' + data);

  /*加密*/
  var cipher = crypto.createCipher(algorithm, key);

  var cipherChunks = [];
  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));

  var re = cipherChunks.join('')
  console.log(cipherEncoding + ' ciphertext: ' + re);
  return re;
}

module.exports = AESFun;