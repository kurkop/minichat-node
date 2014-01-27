var _ = require('underscore');

var chatController = function (server,users){

  var isntLoggedIn = function (req,res,next) {
    if(!req.session.user){
      res.redirect('/');
      return;
    }
    next();
  };

  server.get('/chat',isntLoggedIn,function (req,res) {
    res.render('chat',{
      user:req.session.user,
      users: users
    });
  });

  server.get('/messages/:message',function (req,res) {
    res.send('Tu mensaje es '+req.params.message);
  });

  server.io.route('Connect?',function(req){
    req.io.emit('saludo',{
      message: 'Server Ready'
    });
  });

};

module.exports = chatController