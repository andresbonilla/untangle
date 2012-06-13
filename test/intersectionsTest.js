var geometry = require("../lib/geometry.js")

// exports.intersectionsFound = function(test){
//     test.ok(geometry.intersectionsFound([{point1:{x:0.0,y:1.0},point2:{x:1.0,y:0.0}},{point1:{x:0.0,y:0.0},point2:{x:1.0,y:1.0}}]), "perpendicular intersection");
//     test.ok(geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:1.0,y:0.0},point2:{x:1.0,y:1.0}}]), "point-line intersection");
//     test.ok(geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:1.0,y:0.0},point2:{x:3.0,y:0.0}}]), "parallel colinear intersection");
//     test.ok(geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}}]), "2 pairs of shared points");    
//     test.ok(geometry.intersectionsFound([{point1:{x:2.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:2.0,y:0.0},point2:{x:2.0,y:0.0}}]), "all points equal");   
//     test.ok(geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:0.0,y:2.0}},{point1:{x:0.0,y:1.0},point2:{x:0.0,y:3.0}}]), "vertical colinear lines with overlap intersection");         
//     test.ok(!geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:0.0,y:1.0},point2:{x:2.0,y:1.0}}]), "parallel lines no intersection");    
//     test.ok(!geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:1.0,y:1.0},point2:{x:1.0,y:2.0}}]), "perpendicular lines no intersection");        
//     test.ok(!geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:0.0,y:1.0}},{point1:{x:0.0,y:2.0},point2:{x:0.0,y:3.0}}]), "vertical colinear lines with no overlap");         
//     test.ok(!geometry.intersectionsFound([{point1:{x:0.0,y:0.0},point2:{x:0.0,y:1.0}},{point1:{x:0.0,y:0.0},point2:{x:1.0,y:0.0}}]), "Single shared vertex");         
//     test.done();
// };

// exports.intersectTest = function(test){
//     test.ok(geometry.intersectTest({point1:{x:0.0,y:1.0},point2:{x:1.0,y:0.0}},{point1:{x:0.0,y:0.0},point2:{x:1.0,y:1.0}}), "perpendicular intersection");
//     test.ok(geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:1.0,y:0.0},point2:{x:1.0,y:1.0}}), "point-line intersection");
//     test.ok(geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:1.0,y:0.0},point2:{x:3.0,y:0.0}}), "parallel colinear intersection");
//     test.ok(geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}}), "2 pairs of shared points");    
//     test.ok(geometry.intersectTest({point1:{x:2.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:2.0,y:0.0},point2:{x:2.0,y:0.0}}), "all points equal");   
//     test.ok(geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:0.0,y:2.0}},{point1:{x:0.0,y:1.0},point2:{x:0.0,y:3.0}}), "vertical colinear lines with overlap intersection");         
//     test.ok(!geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:0.0,y:1.0},point2:{x:2.0,y:1.0}}), "parallel lines no intersection");    
//     test.ok(!geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:2.0,y:0.0}},{point1:{x:1.0,y:1.0},point2:{x:1.0,y:2.0}}), "perpendicular lines no intersection");        
//     test.ok(!geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:0.0,y:1.0}},{point1:{x:0.0,y:2.0},point2:{x:0.0,y:3.0}}), "vertical colinear lines with no overlap"); 
//     test.ok(!geometry.intersectTest({point1:{x:0.0,y:0.0},point2:{x:0.0,y:1.0}},{point1:{x:0.0,y:0.0},point2:{x:1.0,y:0.0}}), "Single shared vertex");                 
//     test.done();
// };

exports.pointsEqual = function(test){
    test.ok(geometry.pointsEqual({id: 0, x: 0.0, y: 0.0},{id: 0, x: 0.0, y: 0.0}), "equal");         
    test.ok(!geometry.pointsEqual({id: 0, x:0.0,y:0.0},{id: 1, x:1.0,y:0.0}), "not equal");         
    test.done();
};

