//rocket prefab
class Rocket1P extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        //add object to existing frame
        scene.add.existing(this);
        this.isFiring = false;
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }
    update(){
        //left and right movement
        if(!this.isFiring){
            if(keyA.isDown && this.x >=47){
                this.x -= 2;
            }
            else if(keyD.isDown && this.x <= 578){
                this.x += 2;
            }
        }
        //firing mechanic
        if(Phaser.Input.Keyboard.JustDown(keyW)){
            this.isFiring = true;
            this.sfxRocket.play();
        }

        //move up if fired
        if(this.isFiring && this.y >= 108){
            this.y -= 2;
        }
        //reset on miss
        if(this.y <= 108){
            this.reset();
        }
    }
    reset(){
        this.isFiring = false;
        this.y = 431;
    }
}