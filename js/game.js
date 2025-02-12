import Player from "/valentinesday.github.io/js/player.js";
import Ghost from "/valentinesday.github.io/js/ghost.js";
        
let width = 800;
let height = 625;
let gridSize = 32;
let offset=parseInt(gridSize/2);
let config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 625,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }            
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let cursors;
let player;
let ghosts=[];
let pills;
let pillsCount=0;
let pillsAte=0;
let map;
let layer1;
let layer2;
let graphics;
let scoreText;
let livesImage=[];
let tiles = "pacman-tiles";
let spritesheet = '/valentinesday.github.io/assets/images/pacmansprites.png';
let spritesheetPath = '/valentinesday.github.io/assets/images/pacmansprites.png';
let tilesPath = '/valentinesday.github.io/assets/images/background.png';
let mapPath = '/valentinesday.github.io/assets/levels/codepen-level.json';
let Animation= {
    Player : {
        Eat: 'player-eat',
        Stay: 'player-stay',
        Die: 'player-die'
    },
    Ghost :{
        Blue : {
            Move: 'ghost-blue-move',
        },

        Orange : {
            Move: 'ghost-orange-move',
        },

        White : {
            Move: 'ghost-white-move',
        },

        Pink : {
            Move: 'ghost-pink-move',
        },

        Red : {
            Move: 'ghost-red-move',
        },
    }
};

let gameOverText;
let restartText;
let currentTouch = null;

function preload ()
{
    this.load.spritesheet(spritesheet, spritesheetPath, { frameWidth: gridSize, frameHeight: gridSize });
    this.load.tilemapTiledJSON("map", mapPath);
    this.load.image(tiles, tilesPath);
    this.load.image("pill", "/valentinesday.github.io/assets/images/pac _man_life_counter/spr_lifecounter_0.png");
    this.load.image("lifecounter", "/valentinesday.github.io/assets/images/pac_man_life_counter/spr_lifecounter_0.png");
    if (!this.game.device.os.desktop) {
        this.load.image('arrow', '/valentinesday.github.io/assets/images/ui/arrow.png');
    }
}

function create ()
{    
    this.anims.create({
            key: Animation.Player.Eat,
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 9, end: 13 }),
            frameRate: 10,
            repeat: -1
        });

    this.anims.create({
        key: Animation.Player.Stay,
        frames: [ { key: spritesheet, frame: 9 } ],
        frameRate: 20
    });

    this.anims.create({
        key: Animation.Player.Die,
        frames: this.anims.generateFrameNumbers(spritesheet, { start: 6, end: 8 }),
        frameRate: 1
    });

    this.anims.create({
            key: Animation.Ghost.Blue.Move,
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

    this.anims.create({
            key: Animation.Ghost.Orange.Move,
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

    this.anims.create({
            key: Animation.Ghost.White.Move,
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

    this.anims.create({
            key: Animation.Ghost.Pink.Move,
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 14, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

    this.anims.create({
            key: Animation.Ghost.Red.Move,
            frames: this.anims.generateFrameNumbers(spritesheet, { start: 16, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

    map = this.make.tilemap({ key: "map", tileWidth: gridSize, tileHeight: gridSize });
    const tileset = map.addTilesetImage(tiles);
    
    layer1 = map.createStaticLayer("Layer 1", tileset, 0, 0);
    layer1.setCollisionByProperty({ collides: true});

    layer2 = map.createStaticLayer("Layer 2", tileset, 0, 0);
    layer2.setCollisionByProperty({ collides: true});
    
    let spawnPoint = map.findObject("Objects", obj => obj.name === "Player");  
    let position = new Phaser.Geom.Point(spawnPoint.x + offset, spawnPoint.y - offset);
    player = new Player(this, position, Animation.Player, () => {
        console.log('DieCallback called, lives:', player.life);
        if (player.life <= 0) {
            console.log('Showing game over');
            showGameOver.call(this);
        } else {
            respawn();
        }
    });

    let scene = this;

    pills = this.physics.add.group();
    map.filterObjects("Objects", function (value, index, array) {
        if(value.name == "Pill") {
            let pill=scene.physics.add
                .sprite(value.x + offset, value.y - offset, "pill");
            pills.add(pill);
            pillsCount++;
        }
    });

    
    let ghostsGroup = this.physics.add.group();
    let i=0;
    let skins=[Animation.Ghost.Blue, Animation.Ghost.Red, Animation.Ghost.Orange , Animation.Ghost.Pink];
     map.filterObjects("Objects", function (value, index, array) {        
        if(value.name == "Ghost") {
            let position = new Phaser.Geom.Point(value.x + offset, value.y - offset);
            let ghost = new Ghost(scene, position, skins[i]);
            ghosts.push(ghost);    
            ghostsGroup.add(ghost.sprite);
            i++;
        }
     });

    this.physics.add.collider(player.sprite, layer1);
    this.physics.add.collider(player.sprite, layer2);
    this.physics.add.collider(ghostsGroup, layer1);
    this.physics.add.overlap(player.sprite, pills, function(sprite, pill) {        
        pill.disableBody(true, true);
        pillsAte++;
        player.score += 10;
        scoreText.setText('Score: ' + player.score);
        
        checkWinCondition.call(this);
        
        if(pillsCount == pillsAte) {
            reset();
        }
    }, null, this);

    this.physics.add.overlap(player.sprite, ghostsGroup, function(sprite, ghostSprite) {
        if (player.active) {
            player.die();
            for (let ghost of ghosts) {
                ghost.freeze();
            }   
        }
    }, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    graphics = this.add.graphics();

    scoreText =  this.add.text(25, 595, 'Score: '+player.score).setFontFamily('Arial').setFontSize(18).setColor('#ffffff');
    this.add.text(630, 595, 'Lives:').setFontFamily('Arial').setFontSize(18).setColor('#ffffff');
    for (let i =  0; i < player.life; i++) {
        livesImage.push(this.add.image(700 + (i * 25), 605, 'lifecounter'));
    }

    this.controls = this.add.group();
    if (!this.game.device.os.desktop) {
        this.input.addPointer(3);
        createTouchControls.call(this);
        this.input.keyboard.enabled = false;
    }

    this.input.on('pointerdown', () => {
        if (!this.game.device.os.desktop) {
            return;
        }
        this.input.keyboard.enabled = true;
    });

    function checkWinCondition() {
        if (player.score >= 1760) {
            showWinMessage.call(this);
        }
    }

    this.game.device.os.desktop = this.game.device.os.desktop || /Mac|Win/.test(navigator.platform);

    // Escalado responsivo para Phaser 3.12
    const resizeGame = () => {
        const canvas = document.querySelector('canvas');
        const container = document.getElementById('game-container');
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        
        const scale = Math.min(width / 800, height / 625);
        canvas.style.width = `${800 * scale}px`;
        canvas.style.height = `${625 * scale}px`;
        canvas.style.margin = 'auto';
    };
    
    window.addEventListener('resize', resizeGame);
    resizeGame();
}

function respawn() {
    player.respawn();
    for(let ghost of ghosts) {
            ghost.respawn();
        }    
}

function reset() {
    respawn();
    for (let child of pills.getChildren()) {
        child.enableBody(false, child.x, child.y, true, true);
    }
    pillsAte = 0;
}

function newGame() {
    hideGameOver();
    reset();
    player.life = 3;
    player.score = 0;
    player.active = true;
    player.playing = true;
    for (let i = 0; i < player.life; i++) {
        let image = livesImage[i];
        if (image) {
            image.alpha = 1;
        }
    }
}

function update()
{
    let direction = Phaser.NONE;

    if (this.game.device.os.desktop) {
        if (cursors.left.isDown) direction = Phaser.LEFT;
        else if (cursors.right.isDown) direction = Phaser.RIGHT;
        else if (cursors.up.isDown) direction = Phaser.UP;
        else if (cursors.down.isDown) direction = Phaser.DOWN;
    }

    switch(currentTouch) {
        case 180: direction = Phaser.LEFT; break;
        case 0: direction = Phaser.RIGHT; break;
        case -90: direction = Phaser.UP; break;
        case 90: direction = Phaser.DOWN; break;
    }

    player.setTurn(direction);

    player.setDirections(getDirection(map, layer1, player.sprite));

    if(!player.playing) {
        for(let ghost of ghosts) {
            ghost.freeze();
        }        
    }

    for(let ghost of ghosts) {
        ghost.setDirections(getDirection(map, layer1, ghost.sprite));
    }

    player.setTurningPoint(getTurningPoint(map, player.sprite));

    for(let ghost of ghosts) {
        ghost.setTurningPoint(getTurningPoint(map, ghost.sprite));
    }

    player.update();  

    for(let ghost of ghosts) {
        ghost.update();
    }

    scoreText.setText('Puntaje de mi ratita: '+player.score);

    for (let i = player.life; i < 3; i++) {
        let image = livesImage[i];
        if(image) {
            image.alpha=0;
        }
    }

    if(player.active) {
        if(player.sprite.x < 0 - offset ) {            
            player.sprite.setPosition(width + offset, player.sprite.y);
        }
        else if(player.sprite.x> width + offset) {
            player.sprite.setPosition(0 - offset, player.sprite.y);
        }
    }
}

function drawDebug() {
    graphics.clear();
    player.drawDebug(graphics);
    for(let ghost of ghosts) {
            ghost.drawDebug(graphics);
        }
}

function getDirection(map, layer, sprite) {
    let directions = [];
    let sx=Phaser.Math.FloorTo(sprite.x);
    let sy=Phaser.Math.FloorTo(sprite.y);
    let currentTile = map.getTileAtWorldXY(sx, sy, true);  
    if(currentTile) {

        var x = currentTile.x;
        var y = currentTile.y;

        directions[Phaser.LEFT]     =   map.getTileAt(x-1, y, true, layer);
        directions[Phaser.RIGHT]    =   map.getTileAt(x+1, y, true, layer);
        directions[Phaser.UP]       =   map.getTileAt(x, y-1, true, layer);
        directions[Phaser.DOWN]     =   map.getTileAt(x, y+1, true, layer);

    }

    return directions;
}

function getTurningPoint(map, sprite) {
    let turningPoint = new Phaser.Geom.Point();
    let sx=Phaser.Math.FloorTo(sprite.x);
    let sy=Phaser.Math.FloorTo(sprite.y);
    let currentTile = map.getTileAtWorldXY(sx, sy, true);  
    if(currentTile) {    
        turningPoint.x = currentTile.pixelX + offset;
        turningPoint.y = currentTile.pixelY + offset;
    }

    return turningPoint;
}

function showGameOver() {
    gameOverText = this.add.text(width / 2, height / 2 - 50, 'Jeu terminé', {
        fontSize: '64px',
        fill: '#ff0000',
        align: 'center'
    }).setOrigin(0.5);

    restartText = this.add.text(width / 2, height / 2 + 80, 
        'Ce qui ne se termine jamais,\ncest mon amour pour toi!\nAppuie pour recommencer', {
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center',
        lineSpacing: 10
    }).setOrigin(0.5).setInteractive();

    restartText.on('pointerdown', () => {
        hideGameOver();
        newGame.call(this);
    });

    this.input.keyboard.on('keydown-ENTER', () => {
        hideGameOver();
        newGame.call(this);
    });
}

function hideGameOver() {
    if (gameOverText) {
        gameOverText.destroy();
        gameOverText = null;
    }
    if (restartText) {
        restartText.destroy();
        restartText = null;
    }
}

function showWinMessage() {
    player.active = false;
    player.playing = false;

    // Detener fantasmas
    for (let ghost of ghosts) {
        ghost.freeze();
    }

    gameOverText = this.add.text(width / 2, height / 2 - 50, 'Tu as gagné le jeu!', {
        fontSize: '64px',
        fill: '#00ff00',
        align: 'center'
    }).setOrigin(0.5);

    restartText = this.add.text(width / 2, height / 2 + 80, 
        'Mais pas seulement,\ntu as aussi gagné mon cœu ❤️', {
        fontSize: '32px',
        fill: '#ffffff',
        align: 'center',
        lineSpacing: 10
    }).setOrigin(0.5).setInteractive();

    restartText.on('pointerdown', () => {
        hideWinMessage();
        newGame.call(this);
    });

    this.input.keyboard.on('keydown-ENTER', () => {
        hideWinMessage();
        newGame.call(this);
    });
}

function hideWinMessage() {
    if (gameOverText) {
        gameOverText.destroy();
        gameOverText = null;
    }
    if (restartText) {
        restartText.destroy();
        restartText = null;
    }
}

function createTouchControls() {
    if (!this.game.device.os.desktop) {
        const controlSize = 40;
        const verticalPosition = height - 57;
        
        const createButton = (x, direction) => {
            const btn = this.add.text(x, verticalPosition, getArrowSymbol(direction), {
                fontSize: '24px',
                fill: '#ff69b4',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: { x: 10, y: 10 },
                borderRadius: 20
            })
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(1000);

            btn.on('pointerdown', () => {
                if (player.active) {
                    currentTouch = direction;
                    btn.setAlpha(0.9);
                    player.setTurn(direction);
                }
            });
            
            btn.on('pointerup', () => {
                currentTouch = null;
                btn.setAlpha(0.7);
            });
            
            btn.on('pointerout', () => {
                currentTouch = null;
                btn.setAlpha(0.7);
            });
            
            return btn;
        };

        // Posicionamiento horizontal centrado
        const startX = width/2 - (controlSize * 2 + 10);
        createButton(startX, Phaser.LEFT);
        createButton(startX + controlSize + 10, Phaser.UP);
        createButton(startX + (controlSize + 10) * 2, Phaser.DOWN);
        createButton(startX + (controlSize + 10) * 3, Phaser.RIGHT);

        // Manejo de toques múltiples
        this.input.on('pointermove', (pointer) => {
            if (!player.active || !pointer.isDown) return;
            
            const touchAngle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(
                player.sprite.x, player.sprite.y,
                pointer.worldX, pointer.worldY
            ));
            
            currentTouch = Math.round(touchAngle / 90) * 90;
        });
    }
}

// Modificar la función getArrowSymbol
function getArrowSymbol(direction) {
    const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const symbols = {
        [Phaser.LEFT]: isApple ? '⬅️' : '←',
        [Phaser.RIGHT]: isApple ? '➡️' : '→', 
        [Phaser.UP]: isApple ? '⬆️' : '↑',
        [Phaser.DOWN]: isApple ? '⬇️' : '↓'
    };
    return symbols[direction];
}

      