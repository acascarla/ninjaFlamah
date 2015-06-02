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
            updatePlayersPositions();
            updateLifes();
            updateScores();
            updateReadyStates();
        }
    };

    
    this.registerListener = function(listener) {
        mListeners.push(listener);
    };
    
    // Private
    var playerMovement = function() {

        // Left
        if (wasd.left.isDown){
            mServerReference.onPressLeft(mId,true);
        }else if(!wasd.left.isDown){
            mServerReference.onPressLeft(mId,false);
        }
        // Right
        if (wasd.right.isDown){
            mServerReference.onPressRight(mId,true);
        }
        else if (!wasd.right.isDown)
        {
            mServerReference.onPressRight(mId,false);
        }
        // Up
        if (wasd.up.isDown)
        {
            mServerReference.onPressUp(mId,true);
        }else if (!wasd.up.isDown)
        {
            mServerReference.onPressUp(mId,false);
        }
/*
        if (!mSprite.body.touching.down){
            if (mIsFacingRight){
                mSprite.animations.play('jumpRight');
            }else{
                mSprite.animations.play('jumpLeft');
            }
        }*/
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
        
        // add keyboard controls
        mCursor = phaser.input.keyboard.createCursorKeys();
        wasd = {
            up: phaser.input.keyboard.addKey(Phaser.Keyboard.W),
            left: phaser.input.keyboard.addKey(Phaser.Keyboard.A),
            right: phaser.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        space = phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        space.onDown.add(changeReadyStateOrAttack, this);

        mId = mServerReference.createId(mSprite);
        console.log(mId);

        mWorldPhysicsReference = mWorldReference.getPhysicsReference();


    })();
};