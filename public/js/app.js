/*
	App
*/
Untangle = Ember.Application.create({
	POINT_RADIUS: 10,
  HELD_POINT_RADIUS: 15,
	POINT_FILL_COLOR: '#0F0',
	HELD_POINT_FILL_COLOR: '#F00',
	POINT_STROKE_COLOR: '#000',
	HELD_POINT_STROKE_COLOR: '#000',
	LINE_COLOR: '#000',
	LINE_STROKE_WIDTH: 4,
	POINT_STROKE_WIDTH: 2,
	XMIN: 20,
	XMAX: 500,
	YMIN: 20,
	YMAX: 500,
	
	socket: io.connect(location.protocol + '//' + location.hostname),
	holding: null,
	
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
		
    hold: function () {
			Untangle.holding = this.id;
			this.wasHeld();
			Untangle.socket.emit('hold', { point_id: this.id });
		},

		wasHeld: function () {
			this.held = true;
		},
		
		move: function (x, y) {
			this.wasMoved(x, y);
			Untangle.socket.emit('move', { point_id: this.id, x: this.x, y: this.y });
		},

		wasMoved: function (x, y) {
			this.x = x;
			this.y = y;
		},
		
    release: function () {
			Untangle.holding = null;
			this.wasReleased();
			Untangle.socket.emit('release', {point_id: this.id});
		},
		
		wasReleased: function () {
			this.held = false;
		}	
});

Untangle.Line = Ember.Object.extend({
    point1: null,
    point2: null
});


/*
	Controllers
*/
Untangle.pointsController = Ember.ArrayProxy.create({
		content: [],

    create: function (id, x, y) {
        var point = Untangle.Point.create({
            id: id,
            x: x,
            y: y
        });
        this.pushObject(point);
				return point;
    },

    loadPoints: function (points) {
				this.set('content', []);
        var point;
        for (var i = 0; i < points.length; i++) {
            point = points[i];
            this.create(point.id, point.x, point.y);
        }
    },

    drawAll: function () {
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
									d3.select(this).attr('r', Untangle.HELD_POINT_RADIUS).style("fill", Untangle.HELD_POINT_FILL_COLOR);
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
		            	d3.select(this).attr('r', Untangle.POINT_RADIUS).style("fill", Untangle.POINT_FILL_COLOR);
								}
		        })
				);
    },
		
		find: function (point_id) {
			var points = this.get('content');
			for (var i = 0; i < points.length; i++) {
				if (points[i].id === point_id) {
					return points[i];
				}
			}
		},
		
		pointHeld: function (point_id) {
			var point = Untangle.pointsController.find(point_id);
			point.wasHeld();
			d3.select('circle[id="'+point.id+'"]')
			  .attr('r', Untangle.HELD_POINT_RADIUS)
			  .style('fill', Untangle.HELD_POINT_FILL_COLOR)
			  .style('stroke', Untangle.HELD_POINT_STROKE_COLOR);
		},
		
		pointMoved: function (point_id, x, y) {
			var point = Untangle.pointsController.find(point_id);
			point.wasMoved(x, y);
			d3.select('circle[id="'+point.id+'"]')
		  .attr('cx', x)
		  .attr('cy', y)
		  .attr('r', Untangle.HELD_POINT_RADIUS)
		  .style('fill', Untangle.HELD_POINT_FILL_COLOR)
		  .style('stroke', Untangle.HELD_POINT_STROKE_COLOR)
		  Untangle.linesController.update();
		},
		
		pointReleased: function (point_id) {
			var point = Untangle.pointsController.find(point_id);
			point.wasReleased();
			d3.select('circle[id="'+point.id+'"]')
		  	.attr('r', Untangle.POINT_RADIUS)
		  	.style('fill', Untangle.POINT_FILL_COLOR)
		  	.style('stroke', Untangle.POINT_STROKE_COLOR);
		}
});

Untangle.linesController = Ember.ArrayProxy.create({
    content: [],

    create: function (point1, point2) {
        var line = Untangle.Line.create({
            point1: point1,
            point2: point2
        });
        this.pushObject(line);
				return line;
    },
		
    loadLines: function (lines) {
				this.set('content', []);
        var line, point1, point2, i;
        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            point1 = Untangle.pointsController.objectAt(line.point1);
            point2 = Untangle.pointsController.objectAt(line.point2);
            this.create(point1, point2);
        }
    },

    drawAll: function () {
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

    update: function () {
        d3.selectAll('line')
        	.data(Untangle.linesController.get('content'))
          .attr('x1', function (d) { return d.point1.x; })
          .attr('y1', function (d) { return d.point1.y; })
          .attr('x2', function (d) { return d.point2.x; })
          .attr('y2', function (d) { return d.point2.y; });
    }
});