/*

	Fixtures

*/
var samplePoints = [
    { id: 0, x: 320, y: 230, held: false },
    { id: 1, x: 124, y: 251, held: false },
    { id: 2, x: 145, y: 454, held: false },
    { id: 3, x: 70, y: 330, held: false }
];

var sampleLines = [
    { point1: 0, point2: 1 },
    { point1: 1, point2: 2 },
    { point1: 2, point2: 3 },
    { point1: 3, point2: 0 },
    { point1: 0, point2: 2 }
];

var express = require('express'),
    app     = express.createServer(),
    io      = require('socket.io').listen(app);

app.get("/", function(req, res) {
    res.redirect("/index.html");
});

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions: true, 
    showStack: true
  }));
  app.use(app.router);
});

io.configure(function () { 
  io.set('transports', ['xhr-polling']); 
  io.set('polling duration', 10); 
});

io.sockets.on('connection', function (socket) {
  
  socket.emit('init', { points: samplePoints, lines: sampleLines });
  
  socket.on('hold', function (data) {
    var curr;
    for (var i = 0; i < samplePoints.length; i++) {
      curr = samplePoints[i];
      if (curr.id === data.point_id) {
        curr.held = true;
        socket.broadcast.emit('held', { point_id: curr.id });
        break;
      }
    }
  });

  socket.on('move', function (data) {
    var curr;
    for (var i = 0; i < samplePoints.length; i++) {
      curr = samplePoints[i];
      if (curr.id === data.point_id) {
        curr.x = data.x;
				curr.y = data.y;
        socket.broadcast.emit('moved', { point_id: curr.id, x: curr.x, y: curr.y });
        break;
      }
    }
  });

  socket.on('release', function (data) {
    var curr;
    for (var i = 0; i < samplePoints.length; i++) {
      curr = samplePoints[i];
      if (curr.id === data.point_id) {
        curr.held = false;
        socket.broadcast.emit('released', { point_id: curr.id });
        break;
      }
    }
    // TODO: Check for win condition and broadcast victory if found or write point positions to DB
  });
  
  
});


app.listen(process.env.PORT || 4000);