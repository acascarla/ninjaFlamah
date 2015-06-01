var ninjaFlamah = null;
var phaser = new Phaser.Game(
    800, 
    600, 
    Phaser.AUTO, 
    '', 
    { 
        preload: function() {
            phaser.load.image('sky', 'assets/sky.png');
            phaser.load.image('ground', 'assets/platform.png');
            phaser.load.spritesheet('dude', 'assets/dude.png', 32, 48);
            phaser.load.spritesheet('red', 'assets/red.png', 139, 139);
            phaser.load.spritesheet('green', 'assets/green.png', 139, 139);
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