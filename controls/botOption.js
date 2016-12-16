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
        emitEvent('msg',m.msg)
      }
    })
  }else if(req.body.option == 'down' && global.botChild){
    console.log('kill bot:'+global.botChild.pid);
    emitEvent('msg','kill bot:'+global.botChild.pid);
    var re = global.botChild.kill();
    global.botChild = null;
    console.log('kill bot re:' + re);
    emitEvent('msg','kill bot re:' + re);
    res.send({
      err:0,
      str:'bot Down!',
      data:{
        down:1
      }
    })
  }else if(req.body.option == 'clear' && !global.botChild){
    emitEvent('msg','run cmd: "rm .cookie.json .secret.json"');
    cp.exec('rm .cookie.json .secret.json', (error, stdout, stderr) => {
      if (error) {
        emitEvent('msg',`exec error: ${error}`);
        return;
      }
      emitEvent('msg',`stdout: ${stdout}`);
      emitEvent('msg',`stderr: ${stderr}`);
    });
  }else {
    res.send({
      err:1,
      str:'wrong option'
    })
  }
}


function emitEvent() {
  if(global.socketIo && global.socketIo.sockets){
    global.socketIo.emit(...arguments)
  }
}

module.exports = botOption;