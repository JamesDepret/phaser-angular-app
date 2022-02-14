import { Coordinate } from "src/app/utils/coordinate";

/**
 * Class used to show the blinking rectangles on the map, where the character can move
 */
export default class MovementDisplay {
    private removeRectsTimeStamp: Date | null = null;
    private addRectsTimeStamp: Date | null = null;
    private startMovementAnimation: boolean = false;
    private movementDisplayed: boolean = false;
    private movementRects: Phaser.GameObjects.Graphics[] = [];
    
    private _movableCoordinates : Coordinate[] = [];
    public set movableCoordinates(v : Coordinate[]) {
        this._movableCoordinates = v;
    }
    
    private _scene : Phaser.Scene;
    public set scene(v : Phaser.Scene) {
        this._scene = v;
    }
    
    constructor(scene: Phaser.Scene) {
        this._scene = scene;
    }

    public displayMovementArea(state: boolean) {
        if (state) {
            if (!this.startMovementAnimation) {
                this.startMovementAnimation = true;
                this.movementDisplayed = true;
                this.addRectsTimeStamp = new Date();
            }
            this.movementAnimation();

        } else {
            this.startMovementAnimation = false;
            this.movementRects.forEach(r => r.destroy());
            this.movementRects = [];
            this.movementDisplayed = false;
        }
    }
    private movementAnimation() {
        let timeoutTime = 400;
        if (this.movementDisplayed) {
            if (this.addRectsTimeStamp && new Date(Date.now()) > this.addRectsTimeStamp) {
                this.drawMovement();
                this.addRectsTimeStamp = null;
                this.removeRectsTimeStamp = new Date(Date.now() + timeoutTime);

            } else if (this.removeRectsTimeStamp && new Date(Date.now()) > this.removeRectsTimeStamp) {
                this.movementRects.forEach(r => r.destroy());
                this.movementRects = [];
                this.removeRectsTimeStamp = null;
                this.addRectsTimeStamp = new Date(Date.now() + timeoutTime);
            }
        }
    }
    private drawMovement() {
        let graphics: Phaser.GameObjects.Graphics = this.createNewGraphic();
        graphics.fillStyle(0x000000, 0.4);
        this._movableCoordinates.forEach(c => {
            this.movementRects.push(graphics.fillRect(c.x * 32, c.y * 32, 32, 32));
        })
    }

    private createNewGraphic(): Phaser.GameObjects.Graphics {
        return this._scene.make.graphics({
            x: 0,
            y: 0,
            add: true
        });
    }
}