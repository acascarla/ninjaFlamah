var PlayerObject = function(spriteTemplate){
		var id = null;
        var readyState = null;
        var lifes = null;
        var kills = null;
        var isFacingRight = null;
        var isMovingRight = null;
        var isMovingLeft = null;
        var isMovingUp = null;
        var attackStartedAt = null;
        var killsInterfaceUpdated = null;
        var lifesInterfaceNextUpdate = null;
        var gameIsFinished = null;
        var isAbleToMove = null;
        var killedAt = null;
        var resetGame = null;
        var zzzz = null;
        
        // Sprite
        var sprite = spriteTemplate;

        // Constructor
	    (function() {
	    	id = null;
	        readyState = false;
	        lifes = 1;
	        kills = 0;
	        isFacingRight = true;
	        isMovingRight = false;
	        isMovingLeft = false;
	        isMovingUp = false;
	        attackStartedAt = null;
	        killsInterfaceUpdated = 0;
	        lifesInterfaceNextUpdate = 3;
	        gameIsFinished = false;
	        isAbleToMove = true;
	        killedAt = null;
	        resetGame = false;
	        zzzz = false;
	    })();
}