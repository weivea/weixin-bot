/**
 * Created by weijianli on 16/12/15.
 */
const path = require('path');
const socket_io = require('socket.io');
let io;

function socketIo(server) {
  io = socket_io(server);
  io.on('connection', function (socket) {
    console.log("socket.id:"+socket.id);
    if(global.botChild){
      socket.emit('msg','weixin bot is running!!')
    }
  });
  global.socketIo = io;
}



module.exports = socketIo;