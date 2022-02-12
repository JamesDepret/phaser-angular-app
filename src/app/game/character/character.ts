
import { createCharacter } from "src/app/utils/character";
import { Coordinate } from "src/app/utils/coordinate";
import CombatMenu from "../menu/combat_menu";
import MovementArea from "./movement/movement-area";
import MovementDisplay from "./movement/movement-display";
import MovementMoveChar from "./movement/movement-move-char";

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
    private MenuOpened: boolean = false;
    private spaceDown: boolean = false;

    private combatMenu!: CombatMenu;
    private movementArea: MovementArea;
    private movementDisplay: MovementDisplay;
    private moveChar: MovementMoveChar;

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
        this._sprite = createCharacter(scene, name, xPos, yPos);
        this._currentMap = currentMap;
        this.movementArea = new MovementArea(this._currentMap);
        this.movementDisplay = new MovementDisplay(this.scene);
        this.moveChar = new MovementMoveChar(this.SPRITESPEED, this.sprite, this.name, this._currentCoordinate);
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
        this.moveChar.movableCoordinates = this.movableCoordinates;
    }


    public setEndTurn(state: boolean) {
        if (state) {
            this.MenuOpened = false;
            this.currentCoordinate = this.moveChar.lastKnownAllowedCoordinate;
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
    

    public setCursorValidation(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (!this.endTurn) {
            this.handleSpaceBar(cursors);

            if (this.MenuOpened) {
                this.combatMenu.cursorInput(cursors);
                this.movementDisplay.displayMovementArea(false);
            } else {
                this.movementDisplay.displayMovementArea(true);
                this.moveChar.moveChar(cursors);
            }
        }
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