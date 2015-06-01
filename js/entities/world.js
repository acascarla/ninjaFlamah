var World = function() {
    var mPlatforms = null;
    var mGround = null;
    var mLedges = [];    
    // Interface
    var mReadyStatesContainer = [];
    var mReadySprite = null;
    // Players
    var mPlayers = null;
    
    
    this.getPhysicsReference = function() {
        return mPlatforms;  
    };

    this.setPlayers = function(playersReference){
        mPlayers = playersReference;
        updateReadyStates();
    };
    
    var addBackground = function() {
        phaser.add.sprite(0, 0, 'sky');
    };
    
    var createGround = function() {
        mGround = mPlatforms.create(0, phaser.world.height - 64, 'ground');
        mGround.scale.setTo(2,2);
    };
    
    var createLedges = function() {
        mLedges.push(mPlatforms.create(400, 400, 'ground'));
        mLedges.push(mPlatforms.create(-150, 250, 'ground'));
    };
    
    var enablePhysics = function() {
        phaser.physics.arcade.enable(mPlatforms);
        mGround.body.immovable = true;
        mLedges.forEach(function(ledge) {
            ledge.body.immovable = true;
        });
    };

    // INTERFACE

     var updateReadyStates = function() { 
        mPlayers.forEach(function(player) {  
            if (mPlayers.indexOf(player) == 0) {
                if (player.readyState == false){
                    mReadyStatesContainer[0].loadTexture("red");  
                    console.log("rojo");
                }else{
                    mReadyStatesContainer[0].loadTexture("green");
                    console.log("green")
                }
            }
            if (mPlayers.indexOf(player) == 1) {
                if (player.readyState == false){
                    mReadyStatesContainer[1].loadTexture("red");  
                    console.log("rojo") 
                }else{
                    mReadyStatesContainer[1].loadTexture("green");
                    console.log("green")
                }
            }
        });
    };

    var instantiateInterface = function(){
        mReadySprite = phaser.add.group();
        mReadyStatesContainer[0] = (mReadySprite.create(15, 15, 'red'));
        mReadyStatesContainer[1] = (mReadySprite.create(740, 15, 'red'));
    };


    
    // Constructor
    (function() {       
        mPlayers = new Array();  
        addBackground();  
        // Create ground group
        mPlatforms = phaser.add.group();
        createGround();
        createLedges();
        enablePhysics();

        // Create interface
        instantiateInterface();
        updateReadyStates();
    })();
};