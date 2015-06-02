var Server = function(worldReference) {
    var mPlayers = null;
    var mGameStartState = null;
    var mWorld = worldReference;
    var mGameStarted = false;
    // colliders
    var mPlatforms = null;
    var mGround = null;
    var mLedges = [];  
    var mSprite = null; 
    
    // Public
    this.update = function() {
        phaser.physics.arcade.overlap(mPlayers[0].sprite, mPlayers[1].sprite, onPlayerOverlap, null, this);

        mPlayers.forEach(function(player) {
            player.sprite.body.velocity.x = 0;
            phaser.physics.arcade.collide(player.sprite, mPlatforms);
            if (player.isMovingLeft){
                player.sprite.body.velocity.x = -490;
                if (phaser.time.now - player.attackStartedAt > 100) player.sprite.animations.play('left');
                player.isFacingRight = false;
            }else if(player.isMovingRight){
                player.sprite.body.velocity.x = 490;
                if (phaser.time.now - player.attackStartedAt > 100) player.sprite.animations.play('right');
                player.isFacingRight = true;
            }else{
                if (phaser.time.now - player.attackStartedAt > 100) onNoDirectionPressed(player);
            }
            if (player.isMovingUp){
                if(player.sprite.body.touching.down) {
                    player.sprite.body.velocity.y = -1100;
                    player.isMovingUp = false;
                }
            }
            if (!player.sprite.body.touching.down){
                if (player.isFacingRight){
                    if (phaser.time.now - player.attackStartedAt > 100) player.sprite.animations.play('jumpRight');
                }else{
                    if (phaser.time.now - player.attackStartedAt > 100) player.sprite.animations.play('jumpLeft');
                }
            }
        });
    };

    this.createId = function(){
       //create player sprite
       createPlayerSprite();
        if (mPlayers != null){
            // Crear el nuevo id para el player que lo solicita
            var str1 = "Player";
            var id = str1.concat(mPlayers.length+1);
            mPlayers[mPlayers.length] = new Object();
            mPlayers[mPlayers.length-1].id = id;
            mPlayers[mPlayers.length-1].readyState = false;
            mPlayers[mPlayers.length-1].lifes = 3;
            mPlayers[mPlayers.length-1].kills = 0;
            mPlayers[mPlayers.length-1].isFacingRight = true;
            mPlayers[mPlayers.length-1].isMovingRight = false;
            mPlayers[mPlayers.length-1].isMovingLeft = false;
            mPlayers[mPlayers.length-1].isMovingUp = false;
            mPlayers[mPlayers.length-1].attackStartedAt = null;
            // Sprite config
            mPlayers[mPlayers.length-1].sprite = mSprite;
            phaser.physics.arcade.enable(mPlayers[mPlayers.length-1].sprite);
            mPlayers[mPlayers.length-1].sprite.body.gravity.y = 3800;
            mPlayers[mPlayers.length-1].sprite.body.collideWorldBounds = true;
            if (mPlayers.length == 1) {
                mPlayers[mPlayers.length-1].sprite.position.x = 60;
            }else if(mPlayers.length == 2){
                mPlayers[mPlayers.length-1].sprite.position.x = 740;
                mPlayers[mPlayers.length-1].isFacingRight = false;
            }
            mPlayers[mPlayers.length-1].sprite.justAttacked = false;
            return(mPlayers[mPlayers.length-1].id);
        }
        return "has provocado un problema y no mereces un id digno";
    };

    this.changeReadyState = function(playerId, readyState){
        if (!mGameStarted){
            var sum = 0;
            mPlayers.forEach(function(player) {
                if (player.id.valueOf() == playerId.valueOf()){
                    player.readyState = readyState;
                }
                if (player.readyState) sum++;
                if (sum == mPlayers.length) mGameStarted = true;
            });
        }
    };

    this.getPlayers = function(){
        return mPlayers;
    };

    this.getGameStarted = function() {
        return mGameStarted;
    };

    this.attack = function(playerId){
        mPlayers.forEach(function(player) {
            if (player.id.valueOf() == playerId.valueOf()){
                if (player.isFacingRight){
                    player.sprite.animations.play('attackRight');
                    player.attackStartedAt = phaser.time.now;
                }else if(!player.isFacingRight){
                    player.sprite.animations.play('attackLeft');
                    player.attackStartedAt = phaser.time.now;
                }
                player.sprite.justAttacked = true;
            }
        });
    };

    // MOVEMENT
    this.onPressLeft = function(playerId, isMovingL) { 
        mPlayers.forEach(function(player) {
            if (player.id.valueOf() == playerId.valueOf()){
                player.isMovingLeft = isMovingL;
            }
        });       
    };
    
    this.onPressRight = function(playerId, isMovingR) {
        mPlayers.forEach(function(player) {
            if (player.id.valueOf() == playerId.valueOf()){
                player.isMovingRight = isMovingR;
            }
        });
    };
    
    this.onPressUp = function(playerId, isMovingU) {
        mPlayers.forEach(function(player) {
            if (player.id.valueOf() == playerId.valueOf()){
                player.isMovingUp = isMovingU;
            }
        });
    };
    // Private
    var onNoDirectionPressed = function(player) {
        player.sprite.animations.stop();
        player.sprite.frame = 17;
        if (player.isFacingRight){
            player.sprite.frame = 17;
        }else{
            player.sprite.frame = 12;
        }
    };

    var onPlayerOverlap = function(player1, player2) {
        if (player1.justAttacked){
            if ((mPlayers[0].isFacingRight && player1.position.x < player2.position.x) || (!mPlayers[0].isFacingRight && player1.position.x > player2.position.x)){
                killSomeOne(mPlayers[0], mPlayers[1]);
            }
            player1.justAttacked = false;
        }else if(player2.justAttacked){
            if ((mPlayers[1].isFacingRight && player2.position.x < player1.position.x) || (!mPlayers[1].isFacingRight && player2.position.x > player1.position.x)){
                killSomeOne(mPlayers[1], mPlayers[0]);
            }
            player2.justAttacked = false;
        }
    };

    var killSomeOne = function(killer, killed){
        killed.lifes--;
        killer.kills++;
        console.log(mPlayers[1].lifes, " killer kills: ", mPlayers[0].kills);
    };


    // PHYSICS COLLIDERS
    var createGround = function() {
        mGround = mPlatforms.create(0, phaser.world.height - 50, 'floor');
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

    // Player sprites
    var createPlayerSprite = function(){
        mSprite = phaser.add.sprite(0, 0, 'player');    
        mSprite.animations.add('left', [0, 1, 2], 20, true);
        mSprite.animations.add('right', [3, 4, 5], 20, true);
        mSprite.animations.add('jumpLeft', [8, 7, 6], 10, true);
        mSprite.animations.add('jumpRight', [9, 10, 11], 10, true);
        mSprite.animations.add('attackLeft', [12, 13, 14], 30, false, true);
        mSprite.animations.add('attackRight', [17, 16, 15], 30, false, true);
        mSprite.animations.add('dieLeft', [18, 19], 10, true);
        mSprite.animations.add('dieRight', [21, 20], 10, true);
        mSprite.anchor.setTo(0.5, 0.5);
        mSprite.scale.setTo(0.7, 0.7);
    };
    
    // Constructor
    (function() {
       gameStartState = false;
       mPlayers = new Array();

        // Create ground group
        mPlatforms = phaser.add.group();
        createGround();
        createLedges();
        enablePhysics();
    })();
};