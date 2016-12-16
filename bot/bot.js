//require('reify');
//require('async-to-gen/register');
const config = require('../config')
const tuRingFun = require('./tuRingFun')
const Weixinbot = require('../lib/weixinbot');
var msgStore = {};

const nickNameReg = new RegExp('@'+config.weixin.nickName,'g');

const bot = new Weixinbot();

bot.on('debug', function (args) {
  console.log(...args);
  process.send && process.send({msg:args[0]});
});

bot.on('qrcode', function (url) {
 // console.log(url);
  process.send && process.send({qrcodeUrl:url});

});
bot.on('friend', (msg) => {
  //console.log(msg);
  tuRingFun(msg.Content,msg.Member.UserName).then(function (reMsg) {
    process.send && process.send({msg: '发送信息：'+reMsg});
    bot.sendText(msg.FromUserName, reMsg);
  }).catch(function (err) {
    console.log(err);
  })
});

bot.on('group',(msg) => {
  console.log(msg.Content);
  if(nickNameReg.test(msg.Content)){
    tuRingFun(msg.Content.replace(nickNameReg,''),msg.GroupMember.UserName).then(function (reMsg) {

      var msgStr = `@${msg.GroupMember.NickName} ${reMsg}`
      process.send && process.send({msg: '发送信息：'+msgStr});
      bot.sendText(msg.FromUserName, msgStr);
    }).catch(function (err) {
      console.log(err);
    })
  }else if(/撤回了一条消息]/.test(msg.Content)){
    bot.sendText(msg.FromUserName, `${msg.GroupMember.NickName} 撤回了一条见不得人的消息~珂珂~\n可能是：\n${msgStore[msg.GroupMember.UserName]}`);
  }
  msgStore[msg.GroupMember.UserName] = msg.Content;
});


//module.exports = bot
try{
  bot.run();
}catch (e){
  process.send && process.send({qrcodeUrl:url});
}
