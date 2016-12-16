/**
 * Created by weijianli on 16/12/15.
 */
$(function () {
  var $btn_start = $('#btn-start');
  var $btn_down = $('#btn-down');
  var $btn_clear = $('#btn-clear');
  var $qr_code = $('#qr-code');
  var $msgs = $('#msgs');
  var $r_side = $(".r-side")

  var msgList = []

  $btn_start.click(function () {
    callOpt('start');
  });
  $btn_down.click(function () {
    callOpt('down');
  });
  $btn_clear.click(function () {
    callOpt('clear');
  });
  initSocket();


  function callOpt(option) {
    $.post('/botOption',{
      option:option,
    },function (re) {
      if(re.err){
        alert(re.str)
      }else {
        if(re.data && re.data.qrcodeUrl){
          $qr_code.attr('src',re.data.qrcodeUrl);
        }else if(re.data && re.data.down == 1){
          $qr_code.attr('src',null);
        }
      }
    })
  }

  function initSocket() {
    var http;
    if(/^https/.test(location.href)){
      http = 'https://';
    }else{
      http = 'http://';
    }

    var socket = io.connect(http+location.host);
    socket.on('msg', function (data) {
      msgList.push(data);
      if(msgList.length >200){
        msgList.unshift();
      }
      $msgs.html(msgList.join('\n'));
      $r_side.scrollTop($msgs.outerHeight());
    });
  }
  

});