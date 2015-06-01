var Server = function(worldReference) {
    var mPlayers = null;
    var mGameStartState = null;
    var mWorld = worldReference;
    var mGameStarted = false;
    
    // Public
    this.update = function() {
        
    };

    this.createId = function(){
        if (mPlayers != null){
            // Crear el nuevo id para el player que lo solicita
            var str1 = "Player";
            var id = str1.concat(mPlayers.length+1);
            mPlayers[mPlayers.length] = new Object();
            mPlayers[mPlayers.length-1].id = id;
            mPlayers[mPlayers.length-1].readyState = false;
            mPlayers[mPlayers.length-1].lifes = 3;
            mPlayers[mPlayers.length-1].kills = 0;
            mPlayers[mPlayers.length-1].x = 0;
            mPlayers[mPlayers.length-1].y = 0;
            return(mPlayers[mPlayers.length-1].id);
        }
        return "has provocado un problema y no mereces un id";
    };

    this.changeReadyState = function(playerId, readyState){
        if (!mGameStarted){
            var sum = 0;
            mPlayers.forEach(function(player) {
                if (player.id.valueOf() == playerId.valueOf()){
                    player.readyState = readyState;
                }
                if (player.readyState) sum++;
                if (sum == mPlayers.length) mGameStarted = true;
            });
        }
    };

    this.getPlayers = function(){
        return mPlayers;
    };

    this.getGameStarted = function() {
        return mGameStarted;
    };
    
    
    // Constructor
    (function() {
       gameStartState = false;
       mPlayers = new Array();
    })();
};