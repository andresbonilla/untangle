(function () {
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
      { point1: samplePoints[0], point2: samplePoints[1] },
      { point1: samplePoints[1], point2: samplePoints[2] },
      { point1: samplePoints[2], point2: samplePoints[3] },
      { point1: samplePoints[3], point2: samplePoints[0] },
      { point1: samplePoints[0], point2: samplePoints[2] }
  ];
  
  var XMIN = 20,
      XMAX = 500,
      YMIN = 20,
      YMAX = 500;

  var express  = require('express'),
      app      = express.createServer(),
      io       = require('socket.io').listen(app),
      geometry = require('./lib/geometry.js'),
      holds    = {};

  app.get("/", function(req, res) {
      res.redirect("/index.html");
  });

  app.configure(function (){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
      dumpExceptions: true, 
      showStack: true
    }));
    app.use(app.router);
  });
  
  function shufflePoints () {
    for (var i = 0; i < samplePoints.length; i++) {
      samplePoints[i].x = Math.floor((Math.random()*XMAX)) + XMIN;
      samplePoints[i].y = Math.floor((Math.random()*YMAX)) + YMIN;
    }
  }
  
  function grow () {
    var randomLine = sampleLines[Math.floor((Math.random()*sampleLines.length))],
        newPoint = {id: samplePoints.length, x: 0, y:0, held:false};
    samplePoints.push(newPoint);
    sampleLines.push({point1: newPoint, point2: randomLine.point1});
    sampleLines.push({point1: newPoint, point2: randomLine.point2});
    shufflePoints();
  }
  
  io.configure(function () { 
    io.set('transports', ['xhr-polling']); 
    io.set('polling duration', 10); 
  });

  io.sockets.on('connection', function (socket) {
  
    socket.emit('init', { points: samplePoints, lines: sampleLines });
  
    socket.on('hold', function (data) {
      holds[socket.id] = data.point_id;
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
      delete holds[socket.id];
      if (!geometry.intersectionsFound(sampleLines)) {
          grow();
          io.sockets.emit('solved', { newPoints: samplePoints, newLines: sampleLines });
      }
    });
  
    socket.on('disconnect', function () {
      var curr,
          held_point = holds[socket.id];
      for (var i = 0; i < samplePoints.length; i++) {
        curr = samplePoints[i];
        if (curr.id === held_point) {
          curr.held = false;
          socket.broadcast.emit('released', { point_id: curr.id });
          break;
        }
      }
      delete holds[socket.id];
      if (!geometry.intersectionsFound(sampleLines)) {
          grow();
          io.sockets.emit('solved', { newPoints: samplePoints, newLines: sampleLines });
      }
    });
  });

  app.listen(process.env.PORT || 4000);
}());