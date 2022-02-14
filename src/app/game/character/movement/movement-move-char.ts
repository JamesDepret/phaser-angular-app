import { Coordinate } from "src/app/utils/coordinate";

/**
 * Class used to move the character on screen
 */
export default class MovementMoveChar {
    private name: string
    private sprite: Phaser.Physics.Arcade.Sprite;
    private SPRITESPEED: number;
    private moveLeft: boolean = false;
    private moveRight: boolean = false;
    private moveUp: boolean = false;
    private moveDown: boolean = false;
    private _currentCoordinate: Coordinate;
    private nextSpritePosition: Coordinate | null = null;
    private _movableCoordinates: Coordinate[] = [];
    private isMoving: boolean = false;

    constructor(SPRITESPEED: number, sprite: Phaser.Physics.Arcade.Sprite, charName: string, lastKnownAllowedCoordinate: Coordinate) {
        this.SPRITESPEED = SPRITESPEED;
        this.sprite = sprite;
        this.name = charName;
        this._currentCoordinate = lastKnownAllowedCoordinate;
    }
//#region Properties
    public get currentCoordinate(): Coordinate {
        return this._currentCoordinate;
    }
    public set currentCoordinate(v: Coordinate) {
        this._currentCoordinate = v;
    }
    public set movableCoordinates(v: Coordinate[]) {
        this._movableCoordinates = v;
    }
//#endregion
 
    moveChar(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (this.isMoving) {
            this.moveCharUntilNextTile();
        } else {
            // it seems velocity tends to keep pushing the sprite one more step after you set it to 0,
            // so we ensure here that the sprite is reset to the position it should have ended
            // BUG: because of this our char seems to stutter step between each tile
            if(this.nextSpritePosition){
                this.sprite.setX(this.nextSpritePosition!.x)
                this.sprite.setY(this.nextSpritePosition!.y)
            }
            
            this.cursorMovement(cursors);
        }
    }

    private moveCharUntilNextTile() {
        if (this.moveLeft && this.sprite.x <= this.nextSpritePosition!.x) {
            this.isMoving = false;
        } else if (this.moveRight && this.sprite.x >= this.nextSpritePosition!.x) {
            this.isMoving = false;
        } else if (this.moveUp && this.sprite.y <= this.nextSpritePosition!.y) {
            this.isMoving = false;
        } else if (this.moveDown && this.sprite.y >= this.nextSpritePosition!.y) {
            this.isMoving = false;
        }

        if (!this.isMoving) {
            this.sprite.setVelocity(0, 0);
            this.sprite.setX(this.nextSpritePosition!.x);
            this.sprite.setY(this.nextSpritePosition!.y);
            this.moveLeft = false;
            this.moveRight = false;
            this.moveUp = false;
            this.moveDown = false;
        }
    }

    private cursorMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        let xPos = this.round32(this.sprite.x + 16);
        let yPos = this.round32(this.sprite.y + 16);
        let xCoord = (xPos + 16) / 32 - 1.5;
        let yCoord = (yPos + 16) / 32 - 1.5;

        if (cursors.left?.isDown) {
            if (this._movableCoordinates.find(c => c.x == xCoord - 1 && c.y == yCoord)) {
                this.sprite.anims.play(this.name + '-look-left', true);
                this.nextSpritePosition = { x: this.sprite.x - 32, y: this.sprite.y };
                this.isMoving = true;
                this.moveLeft = true;
                this.sprite.setVelocity(-this.SPRITESPEED, 0);
            }
        }
        else if (cursors.right?.isDown) {
            if (this._movableCoordinates.find(c => c.x == xCoord + 1 && c.y == yCoord)) {
                this.sprite.anims.play(this.name + '-look-right', true);
                this.nextSpritePosition = { x: this.sprite.x + 32, y: this.sprite.y };
                this.isMoving = true;
                this.moveRight = true;
                this.sprite.setVelocity(this.SPRITESPEED, 0);
            }
        }
        else if (cursors.down?.isDown) {
            if (this._movableCoordinates.find(c => c.x == xCoord && c.y == yCoord + 1)) {
                this.sprite.setVelocity(0, this.SPRITESPEED);
                this.sprite.anims.play(this.name + '-look-down', true);
                this.nextSpritePosition = { x: this.sprite.x, y: this.sprite.y + 32 };
                this.isMoving = true;
                this.moveDown = true;
            }
        }
        else if (cursors.up?.isDown) {
            if (this._movableCoordinates.find(c => c.x == xCoord && c.y == yCoord - 1)) {
                this.sprite.setVelocity(0, -this.SPRITESPEED);
                this.sprite.anims.play(this.name + '-look-up', true);
                this.nextSpritePosition = { x: this.sprite.x, y: this.sprite.y - 32 };
                this.isMoving = true;
                this.moveUp = true;
            }
        }
    }

    round32(value: number): number {
        return 32 * (Math.round(value / 32));
    }

}