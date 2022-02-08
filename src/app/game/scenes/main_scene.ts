import Phaser from 'phaser';
import { createCharacter } from 'src/app/utils/character';
import { ENDTURN } from 'src/app/utils/constants';
import { debugHelperDisplayWalls } from 'src/app/utils/debug';
import Character from '../character/character';
import CombatMenu from '../menu/combat_menu';

export class MainScene extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private activeChar!: Character;
	private characterQueue: Character[] = [];

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

		let bowie =  new Character(this, 'bowie', 240, 528, 12, 5, 3, groundLayer, 1) ;
		bowie.addColiders(groundLayer);
		this.characterQueue.push(bowie);
		this.createGizmos(groundLayer);
		this.addGizmoColliders(bowie, groundLayer);
		this.events.on(ENDTURN, this.endTurn, this);
		this.characterQueue.sort((a,b) => a.queueNumber - b.queueNumber);
		this.activeChar = this.characterQueue[0];
    }
	
    override update() {
		if(!this.cursors || !this.activeChar) {
			return;
		}
		this.activeChar.setCursorValidation(this.cursors);
    }

//#region PRIVATE FUNCTIONS
	private endTurn(queueNumber: number){
		if(this.activeChar.queueNumber == queueNumber){
			let index = this.characterQueue.indexOf(this.activeChar);
			index = index + 1 >= this.characterQueue.length ? 0 : index + 1;
			console.log('index char: ' + index)
			this.activeChar = this.characterQueue[ index];
			console.log(this.activeChar.name);
			console.log(this.characterQueue);
		}
	}

    
	private createGizmos(layer: Phaser.Tilemaps.TilemapLayer) {
		let i = 2;
		this.characterQueue.push(new Character(this, 'gizmo', 208, 144, 5, 7, 3, layer, i++));
		this.characterQueue.push(new Character(this, 'gizmo', 208, 112, 5, 7, 3, layer, i++));
		this.characterQueue.push(new Character(this, 'gizmo', 240, 80 , 5, 7, 3, layer, i++));
		this.characterQueue.push(new Character(this, 'gizmo', 272, 80 , 5, 7, 3, layer, i++));
		this.characterQueue.push(new Character(this, 'gizmo', 304, 112, 5, 7, 3, layer, i++));
		this.characterQueue.push(new Character(this, 'gizmo', 304, 144, 5, 7, 3, layer, i++));
	}

	private addGizmoColliders(char: Character, layer: Phaser.Tilemaps.TilemapLayer){
		this.characterQueue.forEach(gizmo => {
			if(gizmo.name.includes("gizmo")){
				gizmo.addColiders(char.sprite);
				gizmo.addColiders(layer);
				this.physics.add.collider(gizmo.sprite, layer);
			}
		})
	}

	
//#endregion PRIVATE FUNCTIONS
}