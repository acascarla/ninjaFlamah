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
            new Player(mWorld, mServer),
            new Player2(mWorld, mServer)
        ];     
        
        for (i = 0; i < mPlayers.length; i++) { 
            mPlayers[i].registerListener(mSelf);
        }   
        
    })();
};