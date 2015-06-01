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
    var mIsFacingRight = true;
    
    // Public
    this.update = function() {
        playerMovement();

        mGameStarted = mServerReference.getGameStarted();
        // Lògica de joc un cop comença
        if (mGameStarted){
            mWorldReference.removeReadySprites();
        }else{
            sendMyPosition();
            updatePlayersPositions();
            updateLifes();
            updateScores();
            updateReadyStates();
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

        if (!mSprite.body.touching.down){
            if (mIsFacingRight){
                mSprite.animations.play('jumpRight');
            }else{
                mSprite.animations.play('jumpLeft');
            }
        }
    };
    var sendMyPosition = function(){
        mServerReference.sendPlayerNewPosition(mId, mSprite.body.position, mIsFacingRight);
    };
    var updatePlayersPositions = function(){
        mWorldReference.updatePlayersPositions(mServerReference.getPlayers());
    };
    var attack = function() {
        mServerReference.attack(mId);
        mWorldReference.attack();
    };
    var updateLifes = function() {
        //mServerReference.attack(mId);
        //mWorldReference.attack();
    };
    var updateScores = function() {
        //mServerReference.attack(mId);
        //mWorldReference.attack();
    };
    var enablePhysics = function() {        
        phaser.physics.arcade.enable(mSprite);
        mSprite.body.gravity.y = 3800;
        mSprite.body.collideWorldBounds = true;    
    };
    
    var onPressLeft = function() {        
        mSprite.body.velocity.x = -490;
        mSprite.animations.play('left');
        mIsFacingRight = false;
    };
    
    var onPressRight = function() {
        mSprite.body.velocity.x = 490;
        mSprite.animations.play('right');
        mIsFacingRight = true;
    };
    
    var onPressUp = function() {
        if(mSprite.body.touching.down) {
            mSprite.body.velocity.y = -1100;
        }
    };
        
    var onNoDirectionPressed = function() {
        mSprite.animations.stop();
        mSprite.frame = 17;
        if (mIsFacingRight){
            mSprite.frame = 17;
        }else{
            mSprite.frame = 12;
        }
    };
    
    var changeReadyStateOrAttack = function(){
        if(!mGameStarted){ // Si no ha començat el joc faig el canvi del ready state
            if (mReadyState){
            mReadyState = false;
            }else{
                mReadyState = true;
            }
            mServerReference.changeReadyState(mId,mReadyState);
        }else{ // Si ja ha començat: la mateixa tecla serveix per atacar
            attack();
        }
    };

    var updateReadyStates = function(){
        var serverPlayers = mServerReference.getPlayers();
        mWorldReference.setPlayers(serverPlayers);
    };
    
    // Constructor
    (function() {
        mSprite = phaser.add.sprite(60, 65, 'player');    
        mSprite.animations.add('left', [0, 1, 2], 10, true);
        mSprite.animations.add('right', [3, 4, 5], 10, true);
        mSprite.animations.add('jumpLeft', [8, 7, 6], 10, true);
        mSprite.animations.add('jumpRight', [9, 10, 11], 10, true);
        mSprite.animations.add('attackLeft', [12, 13, 14], 10, true);
        mSprite.animations.add('attackRight', [17, 16, 15], 10, true);
        mSprite.animations.add('dieLeft', [18, 19], 10, true);
        mSprite.animations.add('dieRight', [21, 20], 10, true);
        mSprite.anchor.setTo(0.5, 0.5);
        mSprite.scale.setTo(0.7, 0.7);

        
        // add keyboard controls
        mCursor = phaser.input.keyboard.createCursorKeys();
        wasd = {
            up: phaser.input.keyboard.addKey(Phaser.Keyboard.W),
            left: phaser.input.keyboard.addKey(Phaser.Keyboard.A),
            right: phaser.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        space = phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        space.onDown.add(changeReadyStateOrAttack, this);

        enablePhysics();

        mId = mServerReference.createId();
        console.log(mId);

        mWorldPhysicsReference = mWorldReference.getPhysicsReference();


    })();
};