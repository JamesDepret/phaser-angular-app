
import { createCharacter } from "src/app/utils/character";
import { Coordinate } from "src/app/utils/coordinate";
import CombatMenu from "../menu/combat_menu";
import MovementArea from "./movement/movement-area";
import MovementDisplay from "./movement/movement-display";

export default class Character {
    private scene: Phaser.Scene;
    private _speed: number;
    private _sprite: Phaser.Physics.Arcade.Sprite;
    private _hp: number;
    private _damage: number;
    private _currentYPosition: number;
    private _currentXPosition: number;
    private _currentHp: number;
    private _name: string;
    private _canFly: boolean;
    private _currentMap: Phaser.Tilemaps.TilemapLayer;
    private _currentCoordinate: Coordinate;
    public queueNumber: number;
    private movableCoordinates: Coordinate[] = [];
    private endTurn: boolean = false;
    private SPRITESPEED: number = 200;

    private combatMenu!: CombatMenu;
    private movementArea: MovementArea;
    private movementDisplay: MovementDisplay;

    constructor(scene: Phaser.Scene, name: string, xPos: number, yPos: number, hp: number, speed: number, damage: number, currentMap: Phaser.Tilemaps.TilemapLayer, queueNumber: number, canFly: boolean = false) {
        this.scene = scene;
        this._hp = hp;
        this._speed = speed;
        this._damage = damage;
        this._currentXPosition = xPos;
        this._currentYPosition = yPos;
        this._currentHp = hp;
        this._name = name;
        this.queueNumber = queueNumber;
        this._canFly = canFly;

        this.combatMenu = new CombatMenu(scene, this.queueNumber);
        this._currentCoordinate = { x: (xPos + 16) / 32 - 1, y: (yPos + 16) / 32 - 1 };
        this.lastKnowAllowedCoordinate = this._currentCoordinate;
        this._sprite = createCharacter(scene, name, xPos, yPos);
        this._currentMap = currentMap;
        this.movementArea = new MovementArea(this._currentMap);
        this.movementDisplay = new MovementDisplay(this.scene);
    }

    //#region properties
    public get currentCoordinate(): Coordinate {
        return this._currentCoordinate;
    }
    public set currentCoordinate(v: Coordinate) {
        this._currentCoordinate = v;
    }

    public get currentMap(): Phaser.Tilemaps.TilemapLayer {
        return this._currentMap;
    }
    public set currentMap(v: Phaser.Tilemaps.TilemapLayer) {
        this._currentMap = v;
    }

    public get canFly(): boolean {
        return this._canFly;
    }
    public set canFly(v: boolean) {
        this._canFly = v;
    }

    public get name(): string {
        return this._name;
    }
    public set name(v: string) {
        this._name = v;
    }

    public get speed(): number {
        return this._speed;
    }
    public set speed(v: number) {
        this._speed = v;
    }

    public get sprite(): Phaser.Physics.Arcade.Sprite {
        return this._sprite;
    }
    public set sprite(v: Phaser.Physics.Arcade.Sprite) {
        this._sprite = v;
    }

    public get hp(): number {
        return this._hp;
    }
    public set hp(v: number) {
        this._hp = v;
    }

    public get damage(): number {
        return this._damage;
    }
    public set damage(v: number) {
        this._damage = v;
    }

    public get currentXPosition(): number {
        return this._currentXPosition;
    }
    public set currentXPosition(v: number) {
        this._currentXPosition = v;
    }

    public get currentYPosition(): number {
        return this._currentYPosition;
    }
    public set currentYPosition(v: number) {
        this._currentYPosition = v;
    }

    public get currentHp(): number {
        return this._currentHp;
    }
    public set currentHp(v: number) {
        this._currentHp = v;
    }
//#endregion properties

    public addColiders(colliderObj: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group | Phaser.GameObjects.Group[]) {
        this.scene.physics.add.collider(this.sprite, colliderObj);
    }
    private calculateMovableCoordinates() {
        this.movableCoordinates = this.movementArea.calculateMovableCoordinates(this.currentCoordinate, this.speed);
        this.movementDisplay.movableCoordinates = this.movableCoordinates;
    }


    public setEndTurn(state: boolean) {
        if (state) {
            this.MenuOpened = false;
            this.currentCoordinate = this.lastKnowAllowedCoordinate;
        } else {
            this.calculateMovableCoordinates()
        }
        this.endTurn = state;
        this.combatMenu.setEndTurn(state);
    }

    
    //-------------------------------------------------------------------------------- REFACTOR --------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------- REFACTOR --------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------- REFACTOR --------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------- REFACTOR --------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------- REFACTOR --------------------------------------------------------------------------------
    

    private MenuOpened: boolean = false;
    private lastMoveUp: boolean = false;
    private lastMoveLeft: boolean = false;
    private lastMoveRight: boolean = false;
    private lastMoveDown: boolean = false;
    private spaceDown: boolean = false;
    private lastKnowAllowedCoordinate: Coordinate;
    private urdlCoordinates: (Coordinate | null)[] = [null, null, null, null]
    public setCursorValidation(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!this.endTurn) {
            this.handleSpaceBar(cursors);

            if (this.MenuOpened) {
                this.combatMenu.cursorInput(cursors);
                this.movementDisplay.displayMovementArea(false);
            } else {
                this.movementDisplay.displayMovementArea(true);
                let xPos = this.round32(this.sprite.x + 16);
                let yPos = this.round32(this.sprite.y + 16);

                let xCoord = (xPos + 16) / 32 - 1.5;
                let yCoord = (yPos + 16) / 32 - 1.5;

                let CoordinateInList = this.movableCoordinates.find(c => c.x == xCoord && c.y == yCoord);
                if (CoordinateInList) this.lastKnowAllowedCoordinate = CoordinateInList;

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
            if (this.lastMoveUp) { this.sprite.setY(this.lastKnowAllowedCoordinate.y * 32 + 16); }
            else if (this.lastMoveLeft) { this.sprite.setX(this.lastKnowAllowedCoordinate.x * 32 + 16); }
            else if (this.lastMoveRight) { this.sprite.setX(this.lastKnowAllowedCoordinate.x * 32 + 16); }
            else { this.sprite.setY(this.lastKnowAllowedCoordinate.y * 32 + 16); }
        }
    }


    round32(value: number): number {
        return 32 * (Math.round(value / 32));
    }

    private handleSpaceBar(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (cursors.space?.isDown && this.spaceDown == false) {
            this.spaceDown = true;
            this.MenuOpened = !this.MenuOpened;
            let EnemyNear = false; // TODO: set value based on range to enemy
            this.combatMenu.toggleCombatMenu(this.MenuOpened, EnemyNear);
        } else if (cursors.space?.isUp && this.spaceDown) {
            this.spaceDown = false;
        }
    }


}