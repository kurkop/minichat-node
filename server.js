var express = require('express.io'),
    swig = require('swig'),
    _ = require('underscore'),
    passport = require('passport');

//Connect Express.io
var server = express();
server.http().io()

//Connect Redis
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var RedisStore = require("connect-redis").createClient(rtg.port, rtg.hostname);

  RedisStore.auth(rtg.auth.split(":")[1]);
} else {
    var RedisStore = require('connect-redis')(express);
}

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
});


//Controllers
var homeController = require('./minichat/controllers/home');
homeController(server,users);

var chatController = require('./minichat/controllers/chat');
chatController(server,users);


var port = Number(process.env.PORT || 3000);
server.listen(port, function() {
  console.log("Listening on " + port);
});
