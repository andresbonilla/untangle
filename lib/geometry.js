(function() {
  /**
  * Tests for the intersection of two line segments.
  * @param {Object} ls1 line segment 1
  * @param {Object} ls2 line segment 2
  * @return {Boolean} Returns a boolean value of true if an intersection is found, false if not.
  */
	exports.intersectTest = function (ls1,ls2) {	  
		var a1 = ls1.point1;
		var a2 = ls1.point2;
		var b1 = ls2.point1;
		var b2 = ls2.point2;
    
	  // First check endpoint commonality: false if just 1, true if more than 1, no conclusion if 0
	  var count = 0;

	  if(a1.id === b1.id){ 
		  count = count + 1; 
		}
	  if(a1.id === b2.id){ 
		  count = count + 1; 
		}
	  if(a2.id === b1.id){ 
		  count = count + 1; 
		}
	  if(a2.id === b2.id){ 
		  count = count + 1; 
		}
	  if(count === 1){ 
		  return false; 
		} else if(count > 1) { 
	    return true; 
	  }
	  
	  // Now verify if each point of each line is on opposite sides of the other line. This is an intersection.
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

  /**
  * Tests for the intersection any two line segments from an array of line segments.
  * @param {Array} lsArray an array of line segments
  * @return {Boolean} Returns a boolean value of true if an intersection is found for any two line segments, false if not.
  */
	exports.intersectionsFound = function (lsArray) {
		// Tests for intersections within an array of line segments, with the exclusion of sharing ONLY one vertex  
	  var l = lsArray.length;
		var i;
		var j;
		// Iterate over every possible combination of line segments within the array
		for(i = 0; i < l; i++) {
			for(j = 0; j < l; j++) {
			  // Do not check a line segment against itself
			  if(i != j) {
			    // If an intersection is found, the function returns true.
				  if(this.intersectTest(lsArray[i],lsArray[j])) {
					  return true;
				  }
			  }	
			}
		}
		return false;
	};

})();