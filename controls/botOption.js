/**
 * Created by weijianli on 16/12/15.
 */
const cp = require('child_process');
global.botChild = null;

function botOption(req, res) {
  if(req.body.option == 'start' && !global.botChild){
    global.botChild = cp.fork(`${process.cwd()}/bot/bot.js`)
    global.botChild.on('message',(m)=>{
      if(m.qrcodeUrl){
        try{
          res.send({
            err:0,
            str:'bot Start!',
            data:{
              qrcodeUrl:m.qrcodeUrl
            }
          })
        }catch (e){console.log(e)}

      }else if(m.msg){
        if(m.msg == '__login_success__'){
          try{
            res.send({
              err:0,
              str:'bot Start!',
            })
          }catch (e){console.log(e)}
        }
        global.socketIo.emit('msg',m.msg)
      }
    })
  }else if(req.body.option == 'down' && global.botChild){
    console.log('kill bot:'+global.botChild.pid);
    global.socketIo.emit('msg','kill bot:'+global.botChild.pid);
    var re = global.botChild.kill();
    global.botChild = null;
    console.log('kill bot re:' + re);
    global.socketIo.emit('msg','kill bot re:' + re);
    res.send({
      err:0,
      str:'bot Down!',
      data:{
        down:1
      }
    })
  }else if(req.body.option == 'clear' && !global.botChild){
    global.socketIo.emit('msg','run cmd: "rm .cookie.json .secret.json"');
    cp.exec('rm .cookie.json .secret.json', (error, stdout, stderr) => {
      if (error) {
        global.socketIo.emit('msg',`exec error: ${error}`);
        return;
      }
      global.socketIo.emit('msg',`stdout: ${stdout}`);
      global.socketIo.emit('msg',`stderr: ${stderr}`);
    });
  }else {
    res.send({
      err:1,
      str:'wrong option'
    })
  }
}

module.exports = botOption;