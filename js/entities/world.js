var World = function() {
    var mPlatforms = null;
    var mGround = null;
    var mLedges = [];    
    // Interface
    var mInterfaceElementsContainer = [];
    var mReadySprite = null;
    var mCanRemoveReadySprites = true;
    // Players
    var mPlayers = null;
    
    
    this.getPhysicsReference = function() {
        return mPlatforms;  
    };

    this.setPlayers = function(playersReference){
        mPlayers = playersReference;
        updateReadyStates();
    };

    this.removeReadySprites = function(){
        if (mCanRemoveReadySprites){
            mInterfaceElementsContainer.forEach(function(readyState) {
                phaser.add.tween(readyState.sprite.scale).to({x: 0, y:0}, 500).start();
                phaser.add.tween(readyState.sprite.position).to({x: 0, y:0}, 700).start();
                // TODO: Appear lifes and Score sprites
                mInterfaceElementsContainer.forEach(function(element){
                    element.lifes.forEach(function(life){
                        phaser.add.tween(life.scale).to({x: 1, y:1}, 400).start();
                    });
                });
            });
            mCanRemoveReadySprites = false;
        }
    };

    this.updatePlayersPositions = function(){
        // TODO

    }
    
    var addBackground = function() {
        phaser.add.tileSprite(0, 0, 800, 600, 'background');
    };
    
    var createGround = function() {
        mGround = mPlatforms.create(0, phaser.world.height - 50, 'floor');
        //mGround.scale.setTo(2,2);
    };
    
    var createLedges = function() {
        // TODO: escenari correcte
        mLedges.push(mPlatforms.create(150, 300, 'block1'));
        mLedges.push(mPlatforms.create(600, 300, 'block1'));
        mLedges.push(mPlatforms.create(300, 500, 'block1'));
        mLedges.push(mPlatforms.create(450, 500, 'block1'));

        mLedges.push(mPlatforms.create(0, 150, 'block2'));
        mLedges.push(mPlatforms.create(0, 450, 'block2'));
        mLedges.push(mPlatforms.create(700, 150, 'block2'));
        mLedges.push(mPlatforms.create(700, 450, 'block2'));
        mLedges.push(mPlatforms.create(350, 200, 'block2'));


        mLedges.push(mPlatforms.create(300, 400, 'block4'));

        mLedges.push(mPlatforms.create(200, 250, 'block8'));
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
        // TODO: millorar aquest hardcode o fer-ho per 4 players
        mPlayers.forEach(function(player) {  
            if (mPlayers.indexOf(player) == 0) {
                if (player.readyState == false){
                    mInterfaceElementsContainer[0].sprite.loadTexture("red");  
                }else{
                    mInterfaceElementsContainer[0].sprite.loadTexture("green");
                }
            }
            if (mPlayers.indexOf(player) == 1) {
                if (player.readyState == false){
                    mInterfaceElementsContainer[1].sprite.loadTexture("red");  
                }else{
                    mInterfaceElementsContainer[1].sprite.loadTexture("green");
                }
            }
        });
    };

    var instantiateInterface = function(){
        mReadySprite = phaser.add.group();
        // Player 1
        mInterfaceElementsContainer[0] = new Object();
        mInterfaceElementsContainer[0].sprite = mReadySprite.create(20, 25, 'red');
        mInterfaceElementsContainer[0].text = phaser.add.text(10, 0, 'Player 1:', { font: '20px Arial', fill: '#FFF' });
        var lifes = [
            mReadySprite.create(5, 25, 'heart'),
            mReadySprite.create(37, 25, 'heart'),
            mReadySprite.create(69, 25, 'heart')
        ];
        lifes.forEach(function(life){
            life.scale.setTo(0.0);
        });
        mInterfaceElementsContainer[0].lifes = lifes;
        var skulls = [
            mReadySprite.create(5, 60, 'skull'),
            mReadySprite.create(5, 90, 'skull'),
            mReadySprite.create(5, 120, 'skull'),
            mReadySprite.create(5, 150, 'skull'),
            mReadySprite.create(5, 180, 'skull'),
            mReadySprite.create(5, 210, 'skull')
        ];
        skulls.forEach(function(skull){
            skull.scale.setTo(0.0);
        });
        mInterfaceElementsContainer[0].kills = skulls;
        // Player 2
        mInterfaceElementsContainer[1] = new Object();
        mInterfaceElementsContainer[1].sprite = mReadySprite.create(730, 25, 'red');
        mInterfaceElementsContainer[1].text = phaser.add.text(715, 0, 'Player 2:', { font: '20px Arial', fill: '#FFF' });
        lifes = [
            mReadySprite.create(700, 25, 'heart'),
            mReadySprite.create(732, 25, 'heart'),
            mReadySprite.create(764, 25, 'heart')
        ];
        lifes.forEach(function(life){
            life.scale.setTo(0.0);
        });
        mInterfaceElementsContainer[1].lifes = lifes;
        skulls = [
            mReadySprite.create(765, 60, 'skull'),
            mReadySprite.create(765, 90, 'skull'),
            mReadySprite.create(765, 120, 'skull'),
            mReadySprite.create(765, 150, 'skull'),
            mReadySprite.create(765, 180, 'skull'),
            mReadySprite.create(765, 210, 'skull')
        ];
        skulls.forEach(function(skull){
            skull.scale.setTo(0.0);
        });
        mInterfaceElementsContainer[1].kills = skulls;
    };

    
    // Constructor
    (function() {       
        mPlayers = new Array();  
        mInterfaceElementsContainer = new Array();
        addBackground();  
        // Create ground group
        mPlatforms = phaser.add.group();
        createGround();
        createLedges();
        enablePhysics();

        // Create interface
        instantiateInterface();
    })();
};