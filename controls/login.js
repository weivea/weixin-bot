/**
 * Created by weijianli on 16/12/15.
 */
const md5Fun = require('../lib/md5Fun');
const config = require('../config')

module.exports = function login(req, res) {
  if(req.body.user != config.user.name){
    res.send({
      err:1,
      str:`用户：${req.body.user}  不存在`,
    });
  }else if(req.body.pass != md5Fun(config.user.pass)){
    res.send({
      err:1,
      str:'密码错误',
    });
  }else {
    req.session.username = req.body.user;
    res.send({
      err:0,
      str:'success',
      data:{
        redirectUrl:'/'
      }
    })
  }
}