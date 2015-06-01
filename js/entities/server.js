var Server = function(worldReference) {
    //var mPlayersContainer = null;
    var mPlayers = null;
    var mGameStartState = null;
    var mWorld = worldReference;
    
    // Public
    this.update = function() {
        
    };

    this.createId = function(){
        if (mPlayers != null){
            // Crear el nuevo id para el player que lo solicita
            var str1 = "Player";
            var res = str1.concat(mPlayers.length+1);
            mPlayers[mPlayers.length] = new Object();
            mPlayers[mPlayers.length-1].id = res;
            mPlayers[mPlayers.length-1].readyState = false;
            return(mPlayers[mPlayers.length-1].id);
        }else{
            console.log("error en el registro, cierra app y vuelve a intentar");
        }
        return "error en el registro, cierra app y vuelve a intentar";
    };

    this.changeReadyState = function(playerId, readyState){
        mPlayers.forEach(function(player) {
            if (player.id.valueOf() == playerId.valueOf()){
                player.readyState = readyState;
                console.log("Server: ",player.id," readyState: ", player.readyState);
            }
        });
    };

    this.getPlayers = function(){
        return mPlayers;
    };
    
    
    // Constructor
    (function() {
       gameStartState = false;
       mPlayers = new Array();
    })();
};