import Phaser from 'phaser';
import { debugHelperDisplayWalls } from 'src/app/utils/debug';
import CombatMenu from '../menu/combat_menu';

export class MainScene extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private bowie!: Phaser.Physics.Arcade.Sprite;
	private SPEED: number = 200;
	private MenuOpened: boolean = false;
	private combatMenu!: CombatMenu;

    constructor() {
      super({ key: 'game' });
    }

    create() {
		this.cursors = this.input.keyboard.createCursorKeys();
        const map = this.make.tilemap({key: 'dungeon'});
        const tileset = map.addTilesetImage('dungeon', 'tiles');

        const groundLayer = map.createLayer('ground', tileset);
        //map.createLayer('upper', tileset); // this is how you add additional layers on top of each other
        groundLayer.setCollisionByProperty({ collides: true });
		//debugHelperDisplayWalls(groundLayer, this);

		this.bowie = this.createCharacter('bowie', 240, 592);
		this.physics.add.collider(this.bowie, groundLayer);

		this.combatMenu = new CombatMenu(this);
    }
    
    override update() {
		if(!this.cursors || !this.bowie) {
			return;
		}
		this.setCursorValidation('bowie', this.bowie);
    }

//#region PRIVATE FUNCTIONS
	/**
	 * 
	 * @param charName Characters name, used in the animations as well
	 * @param x x-location on map
	 * @param y y-location on map
	 * @returns animatable character with callable animations for: 
	 * 
	 * charname + 
	 * - "-look-down", 
	 * - "-look-left", 
	 * - "-look-right", 
	 * - "-look-up"
	 */
	private createCharacter(charName:string, x: number, y: number): Phaser.Physics.Arcade.Sprite {
		const character = this.physics.add.sprite(x , y, charName, charName +'-standing1.png');
		this.createCharAnimation(charName);
		character.anims.play(charName + '-look-down')
		return character;
	}

	private createCharAnimation(charName: string) {
		this.createAnimation(charName + '-look-down', 	charName + '-standing');
		this.createAnimation(charName + '-look-left',  	charName + '-standing-left');
		this.createAnimation(charName + '-look-right', 	charName + '-standing-right');
		this.createAnimation(charName + '-look-up', 	charName + '-standing-up');
	}

	private createAnimation(name: string, pngName: string){
		this.anims.create({
			key: name,
			frames: this.anims.generateFrameNames('bowie', { start: 1, end: 2, prefix: pngName, suffix:'.png'}),
			repeat: -1,
			frameRate: 4
		});
	}

	
	private lastMoveUpOrLeft: boolean = false;
	private spaceDown: boolean = false;
	private setCursorValidation(charName: string, charObj: Phaser.Physics.Arcade.Sprite){
		if(this.cursors.space?.isDown && this.spaceDown == false){
			this.spaceDown = true;
			this.MenuOpened = !this.MenuOpened;
			this.combatMenu.toggleMenu(this.MenuOpened);
		} else if (this.cursors.space?.isUp && this.spaceDown) {
			this.spaceDown = false;
		}
		if(this.MenuOpened){
			this.combatMenu.cursorInput(this.cursors);
		} else {
			if(this.cursors.left?.isDown){
				charObj.setVelocity(-this.SPEED,0);
				this.lastMoveUpOrLeft = true;
				charObj.anims.play(charName + '-look-left', true);
			} 
			else if (this.cursors.right?.isDown) {
				charObj.setVelocity(this.SPEED, 0);
				this.lastMoveUpOrLeft = false;
				charObj.anims.play(charName + '-look-right', true);
			} 
			else if(this.cursors.down?.isDown){
				charObj.setVelocity(0,this.SPEED);
				this.lastMoveUpOrLeft = false;
				charObj.anims.play(charName + '-look-down', true);
			} 
			else if (this.cursors.up?.isDown) {
				charObj.setVelocity(0, -this.SPEED);
				this.lastMoveUpOrLeft = true;
				charObj.anims.play(charName + '-look-up', true);
			} else {
				charObj.setVelocity(0);
				let xPosition = charObj.x;
				let yPosition = charObj.y;
				if((xPosition + 16) % 32 != 0) {
					charObj.setX(this.lastMoveUpOrLeft ? this.round32(xPosition-24) + 16 : this.round32(xPosition+24) - 16);
				}
				
				if((yPosition + 16) % 32 != 0) {
					charObj.setY(this.lastMoveUpOrLeft ? this.round32(yPosition-24) + 16 : this.round32(yPosition+24) - 16);
				}
			}
		}
	}

	round32(value: number): number{
		return 32 * (Math.round(value / 32));
	}

//#endregion PRIVATE FUNCTIONS
}