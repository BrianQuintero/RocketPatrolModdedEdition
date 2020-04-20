class Play2P extends Phaser.Scene{
    constructor(){
        super("playScene2P");
    }

    preload(){
        //load sounds
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        //load images and sprites
        this.load.image('rocket','./assets/rocket.png');
        this.load.image('rocket1P','./assets/rocket1P.png');
        this.load.image('rocket2P','./assets/rocket2P.png');
        this.load.image('newShip','./assets/newShip.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield','./assets/starfield.png');
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});    
    }

    create(){
        //place tile sprite
        this.starfield = this.add.tileSprite(0,0,640,480,'starfield').setOrigin(0,0);
        //white rectangle borders
        this.add.rectangle(5,5,630,32,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,443,630,32,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5,5,32,455,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603,5,32,455,0xFFFFFF).setOrigin(0,0);
        //green UI background
        this.add.rectangle(37,42,566,64,0x00FF00).setOrigin(0,0);
        //add rocket
        this.p1Rocket = new Rocket1P(this, game.config.width/2,431,'rocket1P').setScale(0.5,0.5).setOrigin(0,0);
        this.p2rocket = new Rocket2P(this, game.config.width/2,431, 'rocket2P').setScale(0.5,0.5).setOrigin(0,0);
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10);
        this.sonicShip = new newShip(this, game.config.width, 260, 'newShip', 0, 100);
        //key definitions
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        //Player 1 keycodes 
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        //Player 2 keycodes
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // animation config
        this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
        });
        //scorekeeping
        this.p1Score = 0;
        this.p2Score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        this.scoreLeft2P = this.add.text(480, 54, this.p2Score, scoreConfig);
        this.timer = this.add.text(285, 54, 'time', scoreConfig);
        this.varTime = (game.settings.gameTimer/1000) * 60;
        //game over flag
        this.gameOver = false;
        //60 second clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to restart or ← for menu', scoreConfig).setOrigin(0.5);
            if(this.p1Score > this.p2Score){
                this.add.text(game.config.width/2, game.config.height/2, 'P1 Wins!', scoreConfig).setOrigin(0.5);
            }
            else if(this.p1Score < this.p2Score){
                this.add.text(game.config.width/2, game.config.height/2, 'P2 Wins!', scoreConfig).setOrigin(0.5);
            }
            else{
                this.add.text(game.config.width/2, game.config.height/2, 'Tie!', scoreConfig).setOrigin(0.5);
            }
            this.gameOver = true;
        },null, this);
    }

    update(){
        //game over check
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene");
        }
        if(!this.gameOver){
            this.varTime -= 1;
            this.timer.setText(Math.trunc(this.varTime / 60));
        }
        else{
            this.timer.setText(0);
        }
        this.starfield.tilePositionX -=4;
        if(!this.gameOver){
            this.p1Rocket.update();
            this.p2rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.sonicShip.update();
        }
        //collision detection for player 1
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.sonicShip)){
            this.p1Rocket.reset();
            this.shipExplode(this.sonicShip);
        }
        //player 2 collision
        if(this.checkCollision(this.p2rocket, this.ship01)){
            this.p2rocket.reset();
            this.shipExplode2P(this.ship01);
        }
        if(this.checkCollision(this.p2rocket, this.ship02)){
            this.p2rocket.reset();
            this.shipExplode2P(this.ship02);
        }
        if(this.checkCollision(this.p2rocket, this.ship03)){
            this.p2rocket.reset();
            this.shipExplode2P(this.ship03);
        }
        if(this.checkCollision(this.p2rocket, this.sonicShip)){
            this.p2rocket.reset();
            this.shipExplode2P(this.sonicShip);
        }
    }

    checkCollision(rocket, ship){
        //AABB checking
        if(rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y){
            return true;
        }
        else{
            return false;
        }
    }
    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });       
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;   
        this.sound.play('sfx_explosion'); 
        //console.log(this.p1Score); 
    }
    shipExplode2P(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });       
        this.p2Score += ship.points;
        this.scoreLeft2P.text = this.p2Score;   
        this.sound.play('sfx_explosion');  
        //console.log(this.p2Score);
    }
}