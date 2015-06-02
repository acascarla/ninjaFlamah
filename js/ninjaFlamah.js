var NinjaFlamah = function() {
    var mSelf = this;   
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
    
    this.onPlayerCollideWithStar = function() {
        mScore.onPlayerCollideWithStar();  
    };
    
    var enablePhysics = function() {
        phaser.physics.startSystem(Phaser.Physics.ARCADE); 
    };
        
    (function() {      
        enablePhysics();
        
        mWorld = new World(); 
        mServer = new Server(mWorld);  
        mPlayers = [
            new Player(mWorld, mServer, 1),
            new Player(mWorld, mServer, 2)
        ];     
        
        for (i = 0; i < mPlayers.length; i++) { 
            mPlayers[i].registerListener(mSelf);
        }   
        
    })();
};