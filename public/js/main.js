$(document).on('ready',function(){
  window.io = io.connect();

  io.on('connect',function(socket){
    console.log('Connect...');
    io.emit('Connect');
  });

  io.on('saludo',function(data){
    console.log(data);
  });

  io.on('log-in',function(data){
    $('#users').append('<li>'+data.username+'</li>');
  });

  io.on('log-out',function(data){
    $('#users li').each(function (i,item){
      if(item.innerText === data.username){
        $(item).remove();
      }
    });
  });

});