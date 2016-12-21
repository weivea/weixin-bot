/**
 * Created by weijianli on 16/12/14.
 */
var request = require('superagent');
var config = require('../config');
// var md5Fun = require('./md5Fun.js')
// var AESFun = require('./AESFun.js')


var cfg = config.turing;

function tuRingFun(msg, userId) {
  //console.log(`userId:${userId}`);
  return new Promise(function (resolve, reject) {
    var param = {
      "key": cfg.APIkey,
      "info": msg
    };
    if (userId) {
      param.userid = userId.replace(/[^0-9a-zA-Z]/g,'')
    }

    request
      .post(cfg.APIUrl)
      .send(param)
      .end(function (err, res) {
        //console.log(err,res);
        if (res.status == 200) {
          resolve(opRedata(JSON.parse(res.text)))
        }else {
          reject(res.text)
        }
      });

  })
}

function opRedata(data) {
  var re = '';
  if(data.code == 100000){
    re = data.text;
  }else if(data.code == 200000){
    re = `${data.text}\n${data.url}`
  }else if(data.code == 302000 || data.code == 308000 ){
    re = `${data.text}\n${JSON.stringify(data.list,0,2)}`
  }else if(data.code == 313000){
    re = "真心不懂音乐呀~"
  }else if(data.code == 314000){
    re = "满腹经纶道不出，设计我的2B没给我语言功能~"
  }else {
    re = data.text;
  }
  return re;
}


module.exports = tuRingFun;