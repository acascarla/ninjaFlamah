var ninjaFlamah = null;
var phaser = new Phaser.Game(
    800, 
    600, 
    Phaser.AUTO, 
    '', 
    { 
        preload: function() {
            phaser.load.image('background', 'assets/background.jpg');
            phaser.load.image('floor', 'assets/floor.png');
            phaser.load.image('block1', 'assets/singleBlock.png');
            phaser.load.image('block2', 'assets/doubleBlock.png');
            phaser.load.image('block4', 'assets/quadrupleBlock.png');
            phaser.load.image('block8', 'assets/octupleBlock.png');
            phaser.load.spritesheet('dude', 'assets/dude.png', 32, 48);
            phaser.load.spritesheet('player', 'assets/sprite/player.png', 60, 65);
            phaser.load.spritesheet('red', 'assets/red.png', 139, 139);
            phaser.load.spritesheet('green', 'assets/green.png', 139, 139);
            phaser.load.spritesheet('heart', 'assets/heart.png', 139, 139);
            phaser.load.spritesheet('skull', 'assets/skull.png', 139, 139);
        }, 
        create: function() {
            ninjaFlamah = new NinjaFlamah();
        }, 
        update: function() {
            if(ninjaFlamah) {
                ninjaFlamah.update();   
            }
        }
    }
);
