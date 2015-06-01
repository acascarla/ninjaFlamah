var Player = function(worldReference,serverReference) {
    var mSprite = null;
    var mWorldPhysicsReference = null;
    var mWorldReference = worldReference;
    var mServerReference = serverReference;
    var mCursor = null;
    var mListeners = [];
    var wasd = null;
    var space = null;
    var mReadyState = false;
    var mId = null;
    var mGameStarted = false;
    
    // Public
    this.update = function() {
        playerMovement();

        mGameStarted = mServerReference.getGameStarted();
        // Lògica de joc un cop comença
        if (mGameStarted){
            mWorldReference.removeReadySprites();
        }else{
            updateReadyStates();
            attack();
        }
    };

    
    this.registerListener = function(listener) {
        mListeners.push(listener);
    }
    
    // Private
    var playerMovement = function() {
        phaser.physics.arcade.collide(mSprite, mWorldPhysicsReference);
        mSprite.body.velocity.x = 0;

        if (wasd.left.isDown)
        {
            onPressLeft();
        }
        else if (wasd.right.isDown)
        {
            onPressRight();
        }
        else
        {
            onNoDirectionPressed();
        }

        if (wasd.up.isDown)
        {
            onPressUp();
        }
    };
    var attack = function() {

    };
    var enablePhysics = function() {        
        phaser.physics.arcade.enable(mSprite);
        mSprite.body.gravity.y = 300;
        mSprite.body.collideWorldBounds = true;    
    };
    
    var onPressLeft = function() {        
        mSprite.body.velocity.x = -450;
        mSprite.animations.play('left');
    };
    
    var onPressRight = function() {
        mSprite.body.velocity.x = 450;
        mSprite.animations.play('right');
    };
    
    var onPressUp = function() {
        if(mSprite.body.touching.down) {
            mSprite.body.velocity.y = -1000;
        }
    };
        
    var onNoDirectionPressed = function() {
        mSprite.animations.stop();
        mSprite.frame = 4;         
    };
    
    var changeReadyState = function(){
        if (mReadyState){
            mReadyState = false;
        }else{
            mReadyState = true;
        }
        mServerReference.changeReadyState(mId,mReadyState);
    };

    var updateReadyStates = function(){
        var serverPlayers = mServerReference.getPlayers();
        mWorldReference.setPlayers(serverPlayers);
    };
    

    // Constructor
    (function() {
        mSprite = phaser.add.sprite(32, phaser.world.height - 150, 'dude');    
        mSprite.animations.add('left', [0, 1, 2, 3], 10, true);
        mSprite.animations.add('right', [5, 6, 7, 8], 10, true);

        
        // add keyboard controls
        mCursor = phaser.input.keyboard.createCursorKeys();
        wasd = {
            up: phaser.input.keyboard.addKey(Phaser.Keyboard.W),
            left: phaser.input.keyboard.addKey(Phaser.Keyboard.A),
            right: phaser.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        space = phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        space.onDown.add(changeReadyState, this);

        enablePhysics();
        mSprite.body.gravity.y = 2500;
        
        mId = mServerReference.createId();
        console.log(mId);

        mWorldPhysicsReference = mWorldReference.getPhysicsReference();


    })();
};