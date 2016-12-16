/**
 * Created by weijianli on 16/12/15.
 */
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const socketIo = require('./controls/socketIo')
const session = require('express-session');
const login = require('./controls/login');
const botOption = require('./controls/botOption');
const app = express();
const server = require('http').Server(app);

app.use('/public',express.static('public'));
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
});
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


socketIo(server);
app.get('/', function (req, res) {
  if(!req.session.username){
    res.redirect('/login')
  }else {
    res.render('index.html');
  }
});

app.post('/startWeixin', function (req, res) {
  if(!req.session.username){
    res.redirect('/login');return;
  }


});

app.get('/login', function (req, res) {
  if(req.session.username){
    res.redirect('/');
    return;
  }
  res.render('login.html');
});
app.post('/login', login);
app.post('/botOption', botOption);


server.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});