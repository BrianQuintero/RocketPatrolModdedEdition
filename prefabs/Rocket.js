//rocket prefab
class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        //add object to existing frame
        scene.add.existing(this);
        this.isFiring = false;
    }
    update(){
        //left and right movement
        if(!this.isFiring){
            if(keyLEFT.isDown && this.x >=47){
                this.x -= 2;
            }
            else if(keyRIGHT.isDown && this.x <= 578){
                this.x += 2;
            }
        }
        //firing mechanic
        if(Phaser.Input.Keyboard.JustDown(keyF)){
            this.isFiring = true;
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