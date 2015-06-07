
var gravityObject = function(){
	var y = null;
	(function() {
	    y = 3800;  
	})();
}
var bodyObject = function(){
	var gravity = null;
	var collideWorldBounds = null;
	(function() {
		gravity = new gravityObject();
		collideWorldBounds = true; 
	})();
}
var positionObject = function(){
	var x = null;
	(function() {
	    x = 60;    
	})();
}

var SpriteTemplate = function(){
	var body = null;
	var gravity = null;
	var position = null;
	var justAttacked = null;

	// Constructor
	(function() {
		body = new bodyObject();
		gravity = new gravityObject();
		position = new positionObject();
		justAttacked = false;
	})();
}


// Constructor
	    