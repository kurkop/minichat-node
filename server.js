var express = require('express.io'),
    swig = require('swig'),
    _ = require('underscore'),
    passport = require('passport');

//Connect Express.io
var server = express();
server.http().io()

//Connect Redis
var RedisStore = require('connect-redis')(express);

var users = [];

swig.setDefaults({
  cache : false
});

// View engine
server.engine('html', swig.renderFile );
server.set('view engine', 'html');
server.set('views', __dirname+'/minichat/views/');

// Cookie and session support
server.configure(function(){
  server.use( express.static('./public') );

  server.use( express.logger() );
  server.use( express.cookieParser() );
  server.use( express.bodyParser() );

  server.use( express.session({
    secret : "secretHach93849",
    store  : new RedisStore({})
    // store  : new RedisStore({
    //  host : conf.redis.host,
    //  port : conf.redis.port,
    //  user : conf.redis.user,
    //  pass : conf.redis.pass
    // });  
  }) );

  server.use( passport.initialize() );
  server.use( passport.session() );
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var isntLoggedIn = function (req,res,next) {
  if(!req.session.user){
    res.redirect('/');
    return;
  }
  next();
};

server.get('/',function (req,res) {
  res.render('home');
});

server.get('/chat',isntLoggedIn,function (req,res) {
  res.render('chat',{
    user:req.session.user,
    users: users
  });
});

server.get('/messages/:message',function (req,res) {
  res.send('Tu mensaje es '+req.params.message);
});

server.get('/log-out',function (req,res){
  users = _.without(users, req.session.user)
  server.io.broadcast('log-out',{username: req.session.user});
  req.session.destroy();
  res.redirect('/')
});

server.post('/log-in',function (req,res){
  users.push(req.body.username);

  req.session.user = req.body.username;
  server.io.broadcast('log-in',{username: req.session.user});

  res.redirect('/chat');
});

server.io.route('Connect?',function(req){
  req.io.emit('saludo',{
    message: 'Server Ready'
  });
});

server.listen(3000);
