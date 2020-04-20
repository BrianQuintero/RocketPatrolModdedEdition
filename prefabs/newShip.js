//spaceship prefab
class newShip extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        //store pointValue
        this.points = pointValue;
        this.baseY = y;
    }

    update(){
        this.x -= 5;
        this.y = this.baseY + (20 * Math.sin(this.x/100));
        //wrap around
        if(this.x <= 0-this.width){
            this.reset();
        }
    }
    reset(){
        this.x = game.config.width;
    }
}