/**
 * Created by weijianli on 16/12/15.
 */
$(function () {
  var $user = $('input[name="user"]')
  var $pass = $('input[name="pass"]')
  
  $('#login-form').submit(function (e) {
    e.preventDefault();
    var user = $user.val();
    var pass = $pass.val();
    if(!user){
      alert("请填写用户名")
    }else if(!pass){
      alert("请填写用密码")
    }else {
      $.post('/login',{
        user:user,
        pass:window.md5Fun(pass)
      },function (re) {
        if(re.err){
          alert(re.str)
        }else {
          location.replace(re.data.redirectUrl)
        }
      })
    }

  })
});