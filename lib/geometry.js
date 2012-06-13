(function() {
	exports.pointsEqual = function (p1,p2) {
	// tests the equality of 2 points
		return p1.id === p2.id;
	};

	exports.intersectTest = function (ls1,ls2) {	  
	// tests for intersections between two line segments, with the exclusion of sharing ONLY one vertex
		var a1 = ls1.point1;
		var a2 = ls1.point2;
		var b1 = ls2.point1;
		var b2 = ls2.point2;
    
	  // check endpoint commonality : false if just 1, true if more
	  var count = 0;

	  if(this.pointsEqual(a1,b1)){ 
		  count = count + 1; 
		}
	  if(this.pointsEqual(a1,b2)){ 
		  count = count + 1; 
		}
	  if(this.pointsEqual(a2,b1)){ 
		  count = count + 1; 
		}
	  if(this.pointsEqual(a2,b2)){ 
		  count = count + 1; 
		}
	  if(count === 1){ 
		  return false; 
		} else if(count > 1) { 
	    return true; 
	  }
	  var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
	  var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
	  var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
   
	  if ( u_b != 0 ) {
	    var ua = ua_t / u_b;
	    var ub = ub_t / u_b;
        
	    if ( ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1 ) {
	      return true;
	    } else {
		    return false;
	    }
	  } else {
	    return false;
	  }
	};

	exports.intersectionsFound = function (lsArray) {
		// tests for intersections within an array of line segments, with the exclusion of sharing ONLY one vertex  
	  var l = lsArray.length;
		var i;
		var j;
		for(i = 0; i < l; i++) {
			for(j = 0; j < l; j++) {
			  if(i != j) {
				  if(this.intersectTest(lsArray[i],lsArray[j])) {
					  return [lsArray[i].point1.id + '' + lsArray[i].point2.id, lsArray[j].point1.id + '' + lsArray[j].point2.id];
				  }
			  }	
			}
		}
		return false;
	};

})();