var express = require('express.io'),
    swig = require('swig'),
    _ = require('underscore'),
    RedisStore = require('connect-redis')(express),
    passport = require('passport');

//Connect Express.io
var server = express();
server.http().io()

// Dotenv loads environment variables from .env into ENV (process.env)
// Add your application configuration to your .env file in the root of your project
var dotenv = require('dotenv');
dotenv.load();

//Connect Redis
if (process.env.REDISTOGO_URL) {
  var redisUrl = url.parse(process.env.REDISTOGO_URL);
    var redisAuth = redisUrl.auth.split(":"); // auth 1st part is username and 2nd is password separated by ":"

    var SessionStore = new RedisStore({
        //client: redis,
        host: redisUrl.hostname,
        port: redisUrl.port,
        //user: conf.redis.user,
        db: redisAuth[0],
        pass: redisAuth[1]
     });
} else {
    var SessionStore = new RedisStore({
      //client: redis,
      host: '127.0.0.1',
      port: 6379,
      //user: conf.redis.user,
      //db: 'mydb',
      //pass: 'RedisPASS'
    });
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

  server.use( 
    express.session({
      secret : "secretHach93849",
      store  : SessionStore,
      cookie : { maxAge: 60000 * 60 * 2 } // 2h Session lifetime
    })
  );
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
