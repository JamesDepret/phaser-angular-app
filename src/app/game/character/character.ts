import { createCharacter } from "src/app/utils/character";
import { Coordinate } from "src/app/utils/coordinate";
import CombatMenu from "../menu/combat_menu";

export default class Character  {
    private scene: Phaser.Scene;
    private _speed : number;
    private _sprite : Phaser.Physics.Arcade.Sprite;
    private _hp : number;
    private _damage : number;
    private _currentYPosition : number;
    private _currentXPosition : number;
    private _currentHp : number;
    private _name : string;
    private _canFly : boolean;
    private _currentMap!: Phaser.Tilemaps.TilemapLayer;
    private _currentCoordinate : Coordinate;
    private movableCoordinates: Coordinate[] = [];
    
    public get currentCoordinate() : Coordinate {
        return this._currentCoordinate;
    }
    public set currentCoordinate(v : Coordinate) {
        this._currentCoordinate = v;
    }
    

	private SPRITESPEED: number = 200;
	private combatMenu!: CombatMenu;
    private movementRects: Phaser.GameObjects.Graphics[] = [];

    calculateMovableCoordinates(){
        console.log(this.name + ' -> xtile: ' + this._currentCoordinate.x + ', ytile: ' + this._currentCoordinate.y);
    }

    constructor(scene: Phaser.Scene, name: string, xPos: number, yPos: number, hp: number,  speed: number, damage: number, currentMap: Phaser.Tilemaps.TilemapLayer, canFly: boolean = false) {
        this.scene = scene;
        this._hp = hp;
        this._speed = speed;
        this._damage = damage;
        this._currentXPosition = xPos;
        this._currentYPosition = yPos;
        this._currentHp = hp;
        this._name = name;
        this._canFly = canFly;
        
		this.combatMenu = new CombatMenu(scene);
        this._currentCoordinate = {x: (xPos + 16) /32, y: (yPos + 16)/32};
		this._sprite = createCharacter(scene, name, xPos, yPos);
        this.calculateMovableCoordinates()
    }

    public addColiders(colliderObj: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group | Phaser.GameObjects.Group[]){
		this.scene.physics.add.collider(this.sprite, colliderObj);
    }
    
    
    public get currentMap() : Phaser.Tilemaps.TilemapLayer {
        return this._currentMap;
    }
    public set currentMap(v : Phaser.Tilemaps.TilemapLayer) {
        this._currentMap = v;
    }
    

    public get canFly() : boolean {
        return this._canFly;
    }
    public set canFly(v : boolean) {
        this._canFly = v;
    }
    

    public get name() : string {
        return this._name;
    }
    public set name(v : string) {
        this._name = v;
    }
    
    public get speed() : number {
        return this._speed;
    }
    public set speed(v : number) {
        this._speed = v;
    }
    
    public get sprite() : Phaser.Physics.Arcade.Sprite {
        return this._sprite;
    }
    public set sprite(v : Phaser.Physics.Arcade.Sprite) {
        this._sprite = v;
    }
    
    public get hp() : number {
        return this._hp;
    }
    public set hp(v : number) {
        this._hp = v;
    }

    
    public get damage() : number {
        return this._damage;
    }
    public set damage(v : number) {
        this._damage = v;
    }
    
    
    public get currentXPosition() : number {
        return this._currentXPosition;
    }
    public set currentXPosition(v : number) {
        this._currentXPosition = v;
    }
    
    public get currentYPosition() : number {
        return this._currentYPosition;
    }
    public set currentYPosition(v : number) {
        this._currentYPosition = v;
    }

    public get currentHp() : number {
        return this._currentHp;
    }
    public set currentHp(v : number) {
        this._currentHp = v;
    }
    
    private removeRectsTimeStamp: Date | null = null;
    private addRectsTimeStamp: Date | null = null;
    private startMovementAnimation: boolean = false;
    private movementDisplayed: boolean = false;
    public movement(state: boolean){
        if(state){
            if(!this.startMovementAnimation){
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
        let graphics: Phaser.GameObjects.Graphics = this.createNewGraphic();
        let timeoutTime = 400;
        if(this.movementDisplayed){
            if (this.addRectsTimeStamp && new Date(Date.now()) > this.addRectsTimeStamp) {
                graphics.fillStyle(0x000000, 0.4);
                this.movementRects.push(graphics.fillRect(this.currentXPosition-this.speed*16, this.currentYPosition-this.speed * 16, this.speed * 32, this.speed * 32));    
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
    private createNewGraphic(): Phaser.GameObjects.Graphics {
        return this.scene.make.graphics({
            x: 0,
            y: 0,
            add: true
        });
    }

    
    
	private MenuOpened: boolean = false;
	private lastMoveUpOrLeft: boolean = false;
	private spaceDown: boolean = false;
	public setCursorValidation(cursors: Phaser.Types.Input.Keyboard.CursorKeys ){
        
        if(cursors.space?.isDown && this.spaceDown == false){
			this.spaceDown = true;
			this.MenuOpened = !this.MenuOpened;
			let EnemyNear = false; // TODO: set value based on range to enemy
			this.combatMenu.toggleCombatMenu(this.MenuOpened, EnemyNear); 
		} else if (cursors.space?.isUp && this.spaceDown) {
			this.spaceDown = false;
		}

		if(this.MenuOpened){
			this.combatMenu.cursorInput(cursors);
            this.movement(false);
		} else {
            this.movement(true);
			if(cursors.left?.isDown){
				this.sprite.setVelocity(-this.SPRITESPEED,0);
				this.lastMoveUpOrLeft = true;
				this.sprite.anims.play(this.name + '-look-left', true);
			} 
			else if (cursors.right?.isDown) {
				this.sprite.setVelocity(this.SPRITESPEED, 0);
				this.lastMoveUpOrLeft = false;
				this.sprite.anims.play(this.name + '-look-right', true);
			} 
			else if(cursors.down?.isDown){
				this.sprite.setVelocity(0,this.SPRITESPEED);
				this.lastMoveUpOrLeft = false;
				this.sprite.anims.play(this.name + '-look-down', true);
			} 
			else if (cursors.up?.isDown) {
				this.sprite.setVelocity(0, -this.SPRITESPEED);
				this.lastMoveUpOrLeft = true;
				this.sprite.anims.play(this.name + '-look-up', true);
			} else {
				this.sprite.setVelocity(0);
				let xPosition = this.sprite.x;
				let yPosition = this.sprite.y;
				if((xPosition + 16) % 32 != 0) {
					this.sprite.setX(this.lastMoveUpOrLeft ? this.round32(xPosition-24) + 16 : this.round32(xPosition+24) - 16);
				}
				
				if((yPosition + 16) % 32 != 0) {
					this.sprite.setY(this.lastMoveUpOrLeft ? this.round32(yPosition-24) + 16 : this.round32(yPosition+24) - 16);
				}
			}
		}
	}

	round32(value: number): number{
		return 32 * (Math.round(value / 32));
	}

}