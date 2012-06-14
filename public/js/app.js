/*
  App
*/
Untangle = Ember.Application.create({
    POINT_RADIUS: 10,
    HELD_POINT_RADIUS: 15,
    POINT_FILL_COLOR: '#111',
    HELD_POINT_FILL_COLOR: '#111',
    POINT_STROKE_COLOR: '#42CBED',
    HELD_POINT_STROKE_COLOR: '#F00',
    LINE_COLOR: '#CCC',
    LINE_STROKE_WIDTH: 1,
    POINT_STROKE_WIDTH: 2,
    XMIN: 20,
    XMAX: 1000,
    YMIN: 20,
    YMAX: 700,

    socket: io.connect(location.protocol + '//' + location.hostname),
    holding: null,
    
    // This is called when Ember finishes loading. It is a sort of initialization.
    ready: function () {
        Untangle.socket.on('init', function (data) {
            Untangle.pointsController.loadPoints(data.points);
            Untangle.linesController.loadLines(data.lines);
            Untangle.linesController.drawAll();
            Untangle.pointsController.drawAll();
        });

        Untangle.socket.on('held', function (data) {
            Untangle.pointsController.pointHeld(data.point_id);
        });

        Untangle.socket.on('moved', function (data) {
            Untangle.pointsController.pointMoved(data.point_id, data.x, data.y);
        });

        Untangle.socket.on('released', function (data) {
            Untangle.pointsController.pointReleased(data.point_id);
        });
        
        Untangle.socket.on('solved', function (data) {
            Untangle.pointsController.loadPoints(data.newPoints);
            Untangle.linesController.loadLines(data.newLines);
            Untangle.linesController.drawAll();
            Untangle.pointsController.drawAll();
        });
    }
});


/*
  Model
*/
Untangle.Point = Ember.Object.extend({
    id: null,
    x: null,
    y: null,
    held: false,

    /**
    * This client holds this point
    */
    hold: function () {
        Untangle.holding = this.id;
        this.wasHeld();
        Untangle.socket.emit('hold', {
            point_id: this.id
        });
    },

    /**
    * This point was held by a client, which may be this one.
    */
    wasHeld: function () {
        this.held = true;
    },

    /**
    * This client moves this point
    * @param {Number} x the x coordinate to move the point to
    * @param {Number} y the y coordinate to move the point to
    */
    move: function (x, y) {
        this.wasMoved(x, y);
        Untangle.socket.emit('move', {
            point_id: this.id,
            x: this.x,
            y: this.y
        });
    },

    /**
    * This point was moved by a client, which may be this one.
    * @param {Number} x the x coordinate to move the point to
    * @param {Number} y the y coordinate to move the point to
    */
    wasMoved: function (x, y) {
        this.x = x;
        this.y = y;
    },

    /**
    * This client releases this point
    */
    release: function () {
        Untangle.holding = null;
        this.wasReleased();
        Untangle.socket.emit('release', {
            point_id: this.id
        });
    },

    /**
    * This point was released by a client, which may be this one.
    */
    wasReleased: function () {
        this.held = false;
    }
});

/**
* A line is simply composed of 2 points
*/
Untangle.Line = Ember.Object.extend({
    point1: null,
    point2: null
});


/*
  Controllers
*/
Untangle.pointsController = Ember.ArrayProxy.create({
    content: [],
    
    /**
    * Creates a point object and adds it to the content array of this controller
    * @param {Object} id the point's id
    * @param {Object} x the point's x coordinate
    * @param {Object} y the point's y coordinate
    * @return {Object} Returns the point that was created.
    */
    create: function (id, x, y) {
        var point = Untangle.Point.create({
            id: id,
            x: x,
            y: y
        });
        this.pushObject(point);
        return point;
    },
    
    /**
    * Loads an array of points into Ember by creating point objects and adding them to the content array of this controller
    * @param {Object} points an array of points, each of which has an id, an x coordinate, and a y coordinate.
    */
    loadPoints: function (points) {
        this.set('content', []);
        var point;
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            this.create(point.id, point.x, point.y);
        }
    },

    /**
    * Erases any points that are already drawn and then draws all the points contained in the content array with d3 calls
    */
    drawAll: function () {
        d3.selectAll('circle').remove();
      
        d3.select('svg')
          .selectAll('circle')
          .data(this.get('content'))
          .enter()
          .append('circle')
          .attr('id', function (d) { return d.id; })
          .attr('cx', function (d) { return d.x; })
          .attr('cy', function (d) { return d.y; })
          .attr('r', function (d) { return (d.held ? Untangle.HELD_POINT_RADIUS : Untangle.POINT_RADIUS); })
          .style('fill', function (d) { return (d.held ? Untangle.HELD_POINT_FILL_COLOR : Untangle.POINT_FILL_COLOR); })
          .style('stroke', function (d) { return (d.held ? Untangle.HELD_POINT_STROKE_COLOR : Untangle.POINT_STROKE_COLOR); })
          .style('stroke-width', Untangle.POINT_STROKE_WIDTH)
          .call(d3.behavior.drag()
            .on("dragstart", function (d, i) {
              if (!d.held) {
                d.hold();
                d3.select(this)
                  .attr('r', Untangle.HELD_POINT_RADIUS)
                  .style("fill", Untangle.HELD_POINT_FILL_COLOR)
                  .style('stroke', Untangle.HELD_POINT_STROKE_COLOR);
              }
            })
            .on("drag", function (d, i) {
              if (d.held && Untangle.holding === d.id) {
                d.move(d.x + d3.event.dx, d.y + d3.event.dy);
                d3.select(this).attr('cx', d.x);
                d3.select(this).attr('cy', d.y);
                Untangle.linesController.update();
              }
            })
            .on("dragend", function (d, i) {
              if (d.held && Untangle.holding === d.id) {
                d.release();
                d3.select(this)
                  .attr('r', Untangle.POINT_RADIUS)
                  .style("fill", Untangle.POINT_FILL_COLOR)
                  .style('stroke', Untangle.POINT_STROKE_COLOR);
              }
            }));
    },

    /**
    * Finds a point with the id point_id in the contents array if it exists and returns it.
    * @param {Number} point_id the id of the desired point
    * @return {Object} Returns the point with the id point_id or null if it does not exist there.
    */
    find: function (point_id) {
        var points = this.get('content');
        for (var i = 0; i < points.length; i++) {
            if (points[i].id === point_id) {
                return points[i];
            }
        }
        return null;
    },
    
    /**
    * Makes the necessary updates when a point is held
    * @param {Number} point_id the id of the point
    */
    pointHeld: function (point_id) {
        var point = Untangle.pointsController.find(point_id);
        point.wasHeld();
        d3.select('circle[id="' + point.id + '"]')
          .attr('r', Untangle.HELD_POINT_RADIUS)
          .style('fill', Untangle.HELD_POINT_FILL_COLOR)
          .style('stroke', Untangle.HELD_POINT_STROKE_COLOR);
    },

    /**
    * Makes the necessary updates when a point is moved
    * @param {Number} point_id the id of the point
    */
    pointMoved: function (point_id, x, y) {
        var point = Untangle.pointsController.find(point_id);
        point.wasMoved(x, y);
        d3.select('circle[id="' + point.id + '"]')
          .attr('cx', x).attr('cy', y)
          .attr('r', Untangle.HELD_POINT_RADIUS)
          .style('fill', Untangle.HELD_POINT_FILL_COLOR)
          .style('stroke', Untangle.HELD_POINT_STROKE_COLOR);
        Untangle.linesController.update();
    },

    /**
    * Makes the necessary updates when a point is released
    * @param {Number} point_id the id of the point
    */
    pointReleased: function (point_id) {
        var point = Untangle.pointsController.find(point_id);
        point.wasReleased();
        d3.select('circle[id="' + point.id + '"]')
          .attr('r', Untangle.POINT_RADIUS)
          .style('fill', Untangle.POINT_FILL_COLOR)
          .style('stroke', Untangle.POINT_STROKE_COLOR);
    }
});

Untangle.linesController = Ember.ArrayProxy.create({
    content: [],
    
    /**
    * Creates a line object and adds it to the content array of this controller
    * @param {Object} point1 the first point of this line segment
    * @param {Object} point2 the second point of this line segment
    * @return {Object} Returns the line that was created.
    */
    create: function (point1, point2) {
        var line = Untangle.Line.create({
            point1: point1,
            point2: point2
        });
        this.pushObject(line);
        return line;
    },

    /**
    * Loads an array of lines into Ember by creating line objects and adding them to the content array of this controller
    * @param {Object} lines an array of lines, each of which is composed of 2 points
    */
    loadLines: function (lines) {
        this.set('content', []);
        var line, point1, point2;
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            point1 = Untangle.pointsController.find(line.point1.id);
            point2 = Untangle.pointsController.find(line.point2.id);
            this.create(point1, point2);
        }
    },

    /**
    * Erases any lines that are already drawn and then draws all the lines contained in the content array with d3 calls
    */
    drawAll: function () {
        d3.selectAll('line').remove();
        d3.select('svg')
          .selectAll('line')
          .data(Untangle.linesController.get('content'))
          .enter()
          .append('line')
          .style('stroke', Untangle.LINE_COLOR)
          .style('stroke-width', Untangle.LINE_STROKE_WIDTH)
          .attr('x1', function (d) { return d.point1.x; })
          .attr('y1', function (d) { return d.point1.y; })
          .attr('x2', function (d) { return d.point2.x; })
          .attr('y2', function (d) { return d.point2.y; });
    },

    /**
    * Moves the endpoints of the lines when a point has moved
    */
    update: function () {
        d3.selectAll('line')
          .data(Untangle.linesController.get('content'))
          .attr('x1', function (d) { return d.point1.x; })
          .attr('y1', function (d) { return d.point1.y; })
          .attr('x2', function (d) { return d.point2.x; })
          .attr('y2', function (d) { return d.point2.y; });
    }
});