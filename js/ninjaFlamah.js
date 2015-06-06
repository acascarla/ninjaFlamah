var NinjaFlamah = function() {
    var mInterface = null; 
    var mWorld = null;
    var mServer = null;
    var mPlayers = null;    
    
    this.update = function() {   
        for (i = 0; i < mPlayers.length; i++) { 
            mPlayers[i].update();
        }    
        mServer.update();
    };
    
        
    (function() {      
        mWorld = new World(); 
        mServer = new Server(mWorld);  
        mPlayers = [
            new Player(mWorld, mServer, 1),
            new Player(mWorld, mServer, 2)
        ];    
        
    })();
};