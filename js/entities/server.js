/*
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

    server.listen(8000);

    app.use(express.static(__dirname + '/app'));
    app.get('/',function(req,res){
        res.sendfile(__dirname + 'index.html');
    });


    io.sockets.on('connection', function(socket){
        console.log("a user connected");
        socket.on('sendMessage', function(data) {
            io.socket.emit('sendMessage', {msg: data});
        });

        socket.on('newUser', function(data, callback) {
            sockets.emit
        });

});
*/

var Server = function(worldReference) {
    var mPlayers = null;
    var mWorld = worldReference;
    var mGameStarted = false;
    var mGameFinished = false;
    // colliders
    var mPlatforms = null;
    var mGround = null;
    var mLedges = [];  
    var mSprite = null; 

    // auxiliar
    var mCanPlayDieAnimation = true; // nomes pot morir 1 a la vegada, no hi ha double kill

    // semofors
    var mGameStarted = false;
    var mGameFinished = false;
    var mResetGameCalled = false;
    
    // Public
    this.update = function() {
        phaser.physics.arcade.overlap(mPlayers[0].sprite, mPlayers[1].sprite, onPlayerOverlap, null, this);
        mPlayers.forEach(function(player) {
            player.sprite.body.velocity.x = 0;
            phaser.physics.arcade.collide(player.sprite, mPlatforms);
            if (!mGameFinished){
                playerControl(player);
            }else{
                // Finish game
                finishGame();
                // Check if a player calls for resetGame
                resetGameCalled();
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
            mPlayers[mPlayers.length-1].killsInterfaceUpdated = 0;
            mPlayers[mPlayers.length-1].lifesInterfaceNextUpdate = 3;
            mPlayers[mPlayers.length-1].gameIsFinished = false;
            mPlayers[mPlayers.length-1].isAbleToMove = true;
            mPlayers[mPlayers.length-1].killedAt = null;
            mPlayers[mPlayers.length-1].resetGame = false;
            
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
                if (player.isAbleToMove && !mGameFinished){
                    if (player.isFacingRight){
                        player.sprite.animations.play('attackRight');
                        player.attackStartedAt = phaser.time.now;
                    }else if(!player.isFacingRight){
                        player.sprite.animations.play('attackLeft');
                        player.attackStartedAt = phaser.time.now;
                    }
                    player.sprite.justAttacked = true;
                }
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
    var playerControl = function(player){
        if (player.isAbleToMove){ // Moviment normal
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
        }else{ // lógica de quan et maten
            if (phaser.time.now - player.killedAt < 1000){
                if (mCanPlayDieAnimation){ 
                    if (player.isFacingRight) player.sprite.animations.play('dieRight');
                    if (!player.isFacingRight) player.sprite.animations.play('dieLeft');
                    mCanPlayDieAnimation = false;
                }
            } else {
                player.isAbleToMove = true;
                mCanPlayDieAnimation = true;
                // Respawn at start location
                if (player.id.valueOf() == "Player1") {
                    player.sprite.position.x = 60;
                    player.isFacingRight = true;
                }else{
                    player.sprite.position.x = 740;
                    player.isFacingRight = false;
                }
                player.sprite.position.y = 40;
            }
        }
        
        //finish attack - per saber que l'atack ja s'ha realitzat
        if (phaser.time.now - player.attackStartedAt > 10){
            player.sprite.justAttacked = false;
        }
    }

    var finishGame = function(){
        // Show last die animation becouse has not enetered in playerControl
        mPlayers.forEach(function(player){
            if (player.lifes == 0){
                if (phaser.time.now - player.killedAt < 1000){
                    if (mCanPlayDieAnimation){ 
                        if (player.isFacingRight) player.sprite.animations.play('dieRight');
                        if (!player.isFacingRight) player.sprite.animations.play('dieLeft');
                        mCanPlayDieAnimation = false;
                    }
                }
            }
        });
        mGameStarted = false;
    }

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
        if (player1.justAttacked && mPlayers[1].isAbleToMove){
            if ((mPlayers[0].isFacingRight && player1.position.x < player2.position.x) || (!mPlayers[0].isFacingRight && player1.position.x > player2.position.x)){
                killSomeOne(mPlayers[0], mPlayers[1]);
            }
            player1.justAttacked = false;
        }else if(player2.justAttacked && mPlayers[0].isAbleToMove){
            if ((mPlayers[1].isFacingRight && player2.position.x < player1.position.x) || (!mPlayers[1].isFacingRight && player2.position.x > player1.position.x)){
                killSomeOne(mPlayers[1], mPlayers[0]);
            }
            player2.justAttacked = false;
        }
    };

    var killSomeOne = function(killer, killed){
        killed.lifes--;
        killer.kills++;
        killed.killedAt = phaser.time.now;
        killed.isAbleToMove = false;
        if (killed.lifes == 0){
            mGameFinished = true;
            killed.gameIsFinished = true;
            killer.gameIsFinished = true;
        }
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
        mSprite.animations.add('dieLeft', [18, 19], 3, false, true);
        mSprite.animations.add('dieRight', [21, 20], 3, false, true);
        mSprite.anchor.setTo(0.5, 0.5);
        mSprite.scale.setTo(0.7, 0.7);
    };

    // Reset player values when reset is called
    var resetGameCalled = function(){
        mPlayers.forEach(function(player){
            if (player.resetGame) mResetGameCalled = true;
        })
        if (mResetGameCalled){
            mPlayers.forEach(function(player){
                player.readyState = false;
                player.lifes = 3;
                player.kills = 0;
                player.isFacingRight = true;
                player.isMovingRight = false;
                player.isMovingLeft = false;
                player.isMovingUp = false;
                player.attackStartedAt = null;
                player.killsInterfaceUpdated = 0;
                player.gameIsFinished = false;
                player.isAbleToMove = true;
                player.killedAt = null;
                player.resetGame = false;
                
                // Sprite config
                if (player.id == "Player1") {
                    player.sprite.position.x = 60;
                }else if(player.id == "Player2"){
                    player.sprite.position.x = 740;
                    player.isFacingRight = false;
                }
                player.sprite.position.y = 40;
                player.sprite.justAttacked = false;
            });  
            mGameStarted = false;
            mGameFinished = false;
            mCanPlayDieAnimation = true;
            mResetGameCalled = false;
        }
    };

    
    // Constructor
    (function() {
       
       mPlayers = new Array();
        // Create ground group
        mPlatforms = phaser.add.group();
        createGround();
        createLedges();
        enablePhysics();
    })();
};