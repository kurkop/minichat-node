var _ = require('underscore');

var homeController = function (server,users){
  console.log("Cargo homeController");
  
  server.get('/',function (req,res) {
    res.render('home');
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

};

module.exports = homeController