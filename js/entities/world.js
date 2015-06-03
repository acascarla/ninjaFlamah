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

    //auxiliar
    var mGameFinished = false;
    var mMustDrawFinishInterface = true;
    
    // Això agafa tota la info del server (recollida pel player i enviada aqui pel mateix) i actualitza tot el world (players, attacks, kills, etc)
    this.updateThisWorld = function(playersReference){
        mPlayers = playersReference; // Amb això ja tinc tots els sprites dels players del server
        updateReadyStates(); // TODO: de fer que nomès s'executi quan el joc no hagi començat
        updateInterface(); // TODO: unificar el de adalt amb aquest
    };

    // Això es cridat pel player quan tots els players estan Ready, fa la transició d'interface a començament del joc
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
    
    // ESCENARI
    // Aquestes 3 funcions fan el pintat de l'escenari que no te collisions (les fa el server)
    var addBackground = function() {
        phaser.add.tileSprite(0, 0, 800, 600, 'background');
    };
    
    var createGround = function() {
        //mGround = mPlatforms.create(0, phaser.world.height - 50, 'floor');
    };
    
    var createLedges = function() {
        /* // Això farà el pintat quan el servidor estigui fora, seran les platforms sense colliders
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
        */
    };
    

    // INTERFACE
    // Això es modifica segons es fiquen ready o noReady els players fins que comença la partida
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

    // Pendent Actualitzar les vides conforme les que tingui el player
    var updateInterface = function(){
        mPlayers.forEach(function(player) {  
            if (!mGameFinished){
                if (mPlayers.indexOf(player) == 0) {
                    //LIFES
                    if (player.lifes < mInterfaceElementsContainer[0].lifes.length){
                        mInterfaceElementsContainer[0].lifes[mInterfaceElementsContainer[0].lifes.length-1].scale.setTo(0.0);
                        mInterfaceElementsContainer[0].lifes.pop();
                    }
                    //KILLS
                    if (player.kills > player.killsInterfaceUpdated){
                        mInterfaceElementsContainer[0].kills[player.kills-1].scale.setTo(1.1);
                        //mInterfaceElementsContainer[0].kills.splice(0,1);
                        player.killsInterfaceUpdated++;
                    }
                    // end game
                    if (player.gameIsFinished) mGameFinished = true;
                }
                if (mPlayers.indexOf(player) == 1) {
                    if (player.lifes < mInterfaceElementsContainer[1].lifes.length){
                        //LIFES
                        mInterfaceElementsContainer[1].lifes[mInterfaceElementsContainer[1].lifes.length-1].scale.setTo(0.0);
                        mInterfaceElementsContainer[1].lifes.pop();
                    }
                    //KILLS
                    if (player.kills > player.killsInterfaceUpdated){
                        mInterfaceElementsContainer[1].kills[player.kills-1].scale.setTo(1.1);
                        //mInterfaceElementsContainer[1].kills.splice(0,1);
                        player.killsInterfaceUpdated++;
                    }
                    // end game
                    if (player.gameIsFinished) mGameFinished = true;
                }
            }else{ // Si s'ha acavat el joc perque han matat a algú 3 cops -> Mostro la interface de win lose
                if (mMustDrawFinishInterface){
                    mInterfaceElementsContainer[0].replayButton = phaser.add.button(phaser.width/2-75, phaser.height/2-200, 'replayButton', replayButtonClick, this);
                    mInterfaceElementsContainer[0].backButton = phaser.add.button(phaser.width/2-75, phaser.height/2+20, 'backButton', backButtonClick, this);
                    mMustDrawFinishInterface = false;
                }
            }
        });
    };

    var replayButtonClick = function(){
        // Restart the game
        // Notificar al server

        // Update interface
        resetInterface();
    };
    var backButtonClick = function(){
        console.log("click back");
    };

    var resetInterface = function(){
        // Change property "resetGame" to true to make know to the server that player has clicked reset
        mPlayers.forEach(function(player){ // Això quan estigui amb el server de veritat es fara nomes per 1 player, el del client
            player.resetGame = true;
        });

        // Hide existing
        //lives
        mInterfaceElementsContainer[0].lifes.forEach(function(life){
            life.scale.setTo(0.0);
        });
        mInterfaceElementsContainer[1].lifes.forEach(function(life){
            life.scale.setTo(0.0);
        });
        //kills
        mInterfaceElementsContainer[0].kills.forEach(function(skull){
            skull.scale.setTo(0.0);
        })
        mInterfaceElementsContainer[1].kills.forEach(function(skull){
            skull.scale.setTo(0.0);
        })
        // Buttons
        mInterfaceElementsContainer[0].replayButton.scale.setTo(0.0);
        mInterfaceElementsContainer[0].backButton.scale.setTo(0.0);

        // Reset initial interface
        instantiateInterface();
    }


    

    // Això crea la interface de primeres
    var instantiateInterface = function(){
        // Això esta per dos players, amb el server haurà d'estar per 1 sol player
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
            mReadySprite.create(764, 25, 'heart'),
            mReadySprite.create(732, 25, 'heart'),
            mReadySprite.create(700, 25, 'heart')
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

        // Create ground group  --->> PASSANTSE A SERVER
        //mPlatforms = phaser.add.group();
        //createGround();
        //createLedges();

        // Create interface
        instantiateInterface();
    })();
};