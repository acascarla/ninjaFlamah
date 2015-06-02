var Player = function(worldReference,serverReference, playerNumber) {
    var mSprite = null;
    var mWorldReference = worldReference;
    var mServerReference = serverReference;
    var mListeners = [];
    var wasd = null;
    var space = null;
    var mReadyState = false;
    var mId = null;
    var mGameStarted = false;
    var mIsFacingRight = true;
    var mPlayerNumber = playerNumber;
    
    // Public
    this.update = function() {
        playerMovement();
        updateThisClient();

        mGameStarted = mServerReference.getGameStarted();
        // Interface update quan comença el joc
        if (mGameStarted){
            mWorldReference.removeReadySprites();
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
    };

    var updateThisClient = function(){
        mWorldReference.updateThisWorld(mServerReference.getPlayers());
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
            mServerReference.attack(mId);
        }
    };
    
    // Constructor
    (function() {
        if (mPlayerNumber == 1){
            // add keyboard controls
            wasd = {
                up: phaser.input.keyboard.addKey(Phaser.Keyboard.W),
                left: phaser.input.keyboard.addKey(Phaser.Keyboard.A),
                right: phaser.input.keyboard.addKey(Phaser.Keyboard.D)
            };
            space = phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            space.onDown.add(changeReadyStateOrAttack, this);
        }else if(mPlayerNumber == 2){
            wasd = {
                up: phaser.input.keyboard.addKey(Phaser.Keyboard.UP),
                left: phaser.input.keyboard.addKey(Phaser.Keyboard.LEFT),
                right: phaser.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
            };
            space = phaser.input.keyboard.addKey(Phaser.Keyboard.P);
            space.onDown.add(changeReadyStateOrAttack, this);
        }

        mId = mServerReference.createId(mSprite);
        console.log(mId);
    })();
};