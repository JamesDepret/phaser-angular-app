import { createCharacter } from "src/app/utils/character";
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

	private SPRITESPEED: number = 200;
	private combatMenu!: CombatMenu;
    private movementRects: Phaser.GameObjects.Graphics[] = [];
    private graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, name: string, xPos: number, yPos: number, hp: number,  speed: number, damage: number) {
        this.scene = scene;
        this._hp = hp;
        this._speed = speed;
        this._damage = damage;
        this._currentXPosition = xPos;
        this._currentYPosition = yPos;
        this._currentHp = hp;
        this._name = name;
        
		this.combatMenu = new CombatMenu(scene);
        
		this._sprite = createCharacter(scene, name, xPos, yPos);
        this.graphics = this.scene.make.graphics({
            x: 0,
            y: 0,
            add: true
        });
    }

    public addColiders(colliderObj: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group | Phaser.GameObjects.Group[]){
		this.scene.physics.add.collider(this.sprite, colliderObj);

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
    
    private movementDisplayed: boolean = false;
    public showMovement() {
        if(!this.movementDisplayed){
            this.movementDisplayed = true;
            this.loopMovement();
        }    
    }
    // TODO: DEBUG: it only gets displayed once instead of blinking
    private loopMovement(){
        if(this.movementDisplayed){
            console.log('display rects' + new Date().toLocaleTimeString())
            this.graphics.fillStyle(0x000000, 0.5);
            this.movementRects.push(this.graphics.fillRect(this.currentXPosition-this.speed*16, this.currentYPosition-this.speed * 16, this.speed * 32, this.speed * 32));    
            
            let timeoutTime = 1000;
            setTimeout(() => {
                console.log('remove rects'+ new Date().toLocaleTimeString())
                this.movementRects.forEach(r => r.destroy());
                this.movementRects = [];
                setTimeout(() => {
                    this.loopMovement();
                }, timeoutTime);
            }, timeoutTime);
        }
    }

    private hideMovement() {
        this.movementRects.forEach(r => r.destroy());
        this.movementRects = [];
        this.movementDisplayed = false;
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
            this.showMovement();
		} else {
            this.hideMovement();
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