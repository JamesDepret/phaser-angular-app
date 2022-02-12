import { Coordinate } from "src/app/utils/coordinate";

/**
 * Class used to move the character on screen
 */
export default class MovementMoveChar {
    private name: string
    private sprite: Phaser.Physics.Arcade.Sprite;
    private SPRITESPEED: number;
    private lastMoveUp: boolean = false;
    private lastMoveLeft: boolean = false;
    private lastMoveRight: boolean = false;
    private lastMoveDown: boolean = false;
    private _movableCoordinates : Coordinate[] = [];
    private _lastKnownAllowedCoordinate: Coordinate;
    private urdlCoordinates: (Coordinate | null)[] = [null, null, null, null];
    
    constructor(SPRITESPEED: number, sprite: Phaser.Physics.Arcade.Sprite, charName: string, lastKnownAllowedCoordinate: Coordinate) {
        this.SPRITESPEED = SPRITESPEED;
        this.sprite = sprite;
        this.name = charName;
        this._lastKnownAllowedCoordinate = lastKnownAllowedCoordinate;
    }

    public get lastKnownAllowedCoordinate() : Coordinate {
        return this._lastKnownAllowedCoordinate;
    }
    public set lastKnownAllowedCoordinate(v : Coordinate) {
        this._lastKnownAllowedCoordinate = v;
    }
    
    public get movableCoordinates() : Coordinate[] {
        return this._movableCoordinates;
    }
    public set movableCoordinates(v : Coordinate[]) {
        this._movableCoordinates = v;
    }
    
    moveChar(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        let xPos = this.round32(this.sprite.x + 16);
        let yPos = this.round32(this.sprite.y + 16);

        let xCoord = (xPos + 16) / 32 - 1.5;
        let yCoord = (yPos + 16) / 32 - 1.5;

        let CoordinateInList = this.movableCoordinates.find(c => c.x == xCoord && c.y == yCoord);
        if (CoordinateInList) this.lastKnownAllowedCoordinate = CoordinateInList;

        if (cursors.left?.isDown && CoordinateInList) {
            if (this.urdlCoordinates[3] == null && !this.lastMoveLeft || this.lastMoveLeft && this.urdlCoordinates[3] != null) {
                this.urdlCoordinates = [null, null, null, this.movableCoordinates.find(c => c.x == xCoord - 1 && c.y == yCoord) ?? null];
            }

            this.setDirection(false, false, false, true);
            if (this.urdlCoordinates[3]) {
                this.sprite.setVelocity(-this.SPRITESPEED, 0);
                this.sprite.anims.play(this.name + '-look-left', true);
            }
        }
        else if (cursors.right?.isDown && CoordinateInList) {
            if (this.urdlCoordinates[1] == null && !this.lastMoveRight || this.urdlCoordinates[1] != null && this.lastMoveRight) {
                this.urdlCoordinates = [null, this.movableCoordinates.find(c => c.x == xCoord + 1 && c.y == yCoord) ?? null, null, null];
            }

            this.setDirection(false, true, false, false);
            if (this.urdlCoordinates[1]) {
                this.sprite.setVelocity(this.SPRITESPEED, 0);
                this.sprite.anims.play(this.name + '-look-right', true);
            }
        }
        else if (cursors.down?.isDown && CoordinateInList) {
            if (this.urdlCoordinates[2] == null && !this.lastMoveDown || this.urdlCoordinates[2] != null && this.lastMoveDown) {
                this.urdlCoordinates = [null, null, this.movableCoordinates.find(c => c.x == xCoord && c.y == yCoord + 1) ?? null, null];
            }
            this.setDirection(false, false, true, false);
            if (this.urdlCoordinates[2]) {
                this.sprite.setVelocity(0, this.SPRITESPEED);
                this.sprite.anims.play(this.name + '-look-down', true);
            }
        }
        else if (cursors.up?.isDown && CoordinateInList) {
            console.log("here");
            if (this.urdlCoordinates[0] == null && !this.lastMoveUp || this.urdlCoordinates[0] != null && this.lastMoveUp) {
                this.urdlCoordinates = [this.movableCoordinates.find(c => c.x == xCoord && c.y == yCoord - 1) ?? null, null, null, null];
            }

            this.setDirection(true, false, false, false);
            if (this.urdlCoordinates[0]) {
                this.sprite.setVelocity(0, -this.SPRITESPEED);
                this.sprite.anims.play(this.name + '-look-up', true);
            }
        } else {
            this.correctPosition();
        }
    }
    
    private setDirection(up: boolean, right: boolean, down: boolean, left: boolean) {
        this.lastMoveUp = up;
        this.lastMoveLeft = left;
        this.lastMoveRight = right;
        this.lastMoveDown = down;
    }

    private correctPosition() {
        this.sprite.setVelocity(0);
        let xPosition = this.sprite.x;
        let yPosition = this.sprite.y;
        if ((xPosition + 16) % 32 != 0) {
            if (this.lastMoveLeft) { this.sprite.setX(this.round32(xPosition - 24) + 16); }
            if (this.lastMoveRight) { this.sprite.setX(this.round32(xPosition + 24) - 16); }
            this.sprite.setY(this.round32(yPosition - 24) + 16);
        }

        if ((yPosition + 16) % 32 != 0) {
            if (this.lastMoveLeft) { this.sprite.setY(this.round32(yPosition - 24) + 16); }
            if (!this.lastMoveRight && !this.lastMoveLeft && !this.lastMoveUp) { this.sprite.setY(this.round32(yPosition + 24) - 16); }
            this.sprite.setX(this.round32(xPosition - 24) + 16);
        }
        xPosition = this.sprite.x;
        yPosition = this.sprite.y;
        let xCoord = (this.round32(xPosition) + 16) / 32 - 1.5;
        let yCoord = (this.round32(yPosition) + 16) / 32 - 1.5;
        let CoordinateInList = this.movableCoordinates.find(c => c.x == xCoord && c.y == yCoord);
        if (!CoordinateInList) {
            if (this.lastMoveUp) { this.sprite.setY(this.lastKnownAllowedCoordinate.y * 32 + 16); }
            else if (this.lastMoveLeft) { this.sprite.setX(this.lastKnownAllowedCoordinate.x * 32 + 16); }
            else if (this.lastMoveRight) { this.sprite.setX(this.lastKnownAllowedCoordinate.x * 32 + 16); }
            else { this.sprite.setY(this.lastKnownAllowedCoordinate.y * 32 + 16); }
        }
    }


    round32(value: number): number {
        return 32 * (Math.round(value / 32));
    }

}