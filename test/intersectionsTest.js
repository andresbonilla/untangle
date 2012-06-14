var geometry = require("../lib/geometry.js")

/* 
  Assertions for intersectionsFound function
*/
exports.intersectionsFound = function(test){
    test.ok(geometry.intersectionsFound([{point1:{id: 0, x:0.0,y:1.0},point2:{id: 1, x:1.0,y:0.0}},{point1:{id: 2, x:0.0,y:0.0},point2:{id: 3, x:1.0,y:1.0}}]), "perpendicular intersection");
    test.ok(geometry.intersectionsFound([{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 2, x:1.0,y:0.0},point2:{id: 3, x:1.0,y:1.0}}]), "point-line intersection");
    test.ok(geometry.intersectionsFound([{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}}]), "2 pairs of shared points");    
    test.ok(!geometry.intersectionsFound([{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 2, x:0.0,y:1.0},point2:{id: 3, x:2.0,y:1.0}}]), "parallel lines no intersection");    
    test.ok(!geometry.intersectionsFound([{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 2, x:1.0,y:1.0},point2:{id: 3, x:1.0,y:2.0}}]), "perpendicular lines no intersection");        
    test.ok(!geometry.intersectionsFound([{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:0.0,y:1.0}},{point1:{id: 2, x:0.0,y:2.0},point2:{id: 3, x:0.0,y:3.0}}]), "vertical colinear lines with no overlap");         
    test.ok(!geometry.intersectionsFound([{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:0.0,y:1.0}},{point1:{id: 0, x:0.0,y:0.0},point2:{id: 2, x:1.0,y:0.0}}]), "Single shared vertex");         
    test.done();
};

/* 
  Assertions for intersectTest function
*/
exports.intersectTest = function(test){
    test.ok(geometry.intersectTest({point1:{id: 0, x:0.0,y:1.0},point2:{id: 1, x:1.0,y:0.0}},{point1:{id: 2, x:0.0,y:0.0},point2:{id: 3, x:1.0,y:1.0}}), "perpendicular intersection");
    test.ok(geometry.intersectTest({point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 2, x:1.0,y:0.0},point2:{id: 3, x:1.0,y:1.0}}), "point-line intersection");
    test.ok(geometry.intersectTest({point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}}), "2 pairs of shared points");    
    test.ok(!geometry.intersectTest({point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 2, x:0.0,y:1.0},point2:{id: 3, x:2.0,y:1.0}}), "parallel lines no intersection");    
    test.ok(!geometry.intersectTest({point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:2.0,y:0.0}},{point1:{id: 2, x:1.0,y:1.0},point2:{id: 3, x:1.0,y:2.0}}), "perpendicular lines no intersection");        
    test.ok(!geometry.intersectTest({point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:0.0,y:1.0}},{point1:{id: 2, x:0.0,y:2.0},point2:{id: 3, x:0.0,y:3.0}}), "vertical colinear lines with no overlap"); 
    test.ok(!geometry.intersectTest({point1:{id: 0, x:0.0,y:0.0},point2:{id: 1, x:0.0,y:1.0}},{point1:{id: 0, x:0.0,y:0.0},point2:{id: 2, x:1.0,y:0.0}}), "Single shared vertex");                 
    test.done();
};