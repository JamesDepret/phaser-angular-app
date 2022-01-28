import Phaser from 'phaser';
import { createCharacter } from 'src/app/utils/character';
import { debugHelperDisplayWalls } from 'src/app/utils/debug';
import Character from '../character/character';
import CombatMenu from '../menu/combat_menu';

export class MainScene extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private bowie!: Character;
	private gizmos: Character[] = [];
	private activeChar!: Character;

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

		this.bowie = new Character(this, 'bowie', 240, 528, 12, 2, 3, groundLayer);
		this.bowie.calculateMovableCoordinates();
		this.activeChar = this.bowie;
		this.bowie.addColiders(groundLayer);
		this.createGizmos(groundLayer);
		this.addGizmoColliders(this.bowie, groundLayer);

    }
    override update() {
		if(!this.cursors || !this.bowie) {
			return;
		}
		this.activeChar.setCursorValidation(this.cursors);
    }

//#region PRIVATE FUNCTIONS
	

    
	private createGizmos(layer: Phaser.Tilemaps.TilemapLayer) {
		this.gizmos = [];
		this.gizmos.push(new Character(this, 'gizmo', 208, 144, 5, 7, 3, layer));
		this.gizmos.push(new Character(this, 'gizmo', 208, 112, 5, 7, 3, layer));
		this.gizmos.push(new Character(this, 'gizmo', 240, 80 , 5, 7, 3, layer));
		this.gizmos.push(new Character(this, 'gizmo', 272, 80 , 5, 7, 3, layer));
		this.gizmos.push(new Character(this, 'gizmo', 304, 112, 5, 7, 3, layer));
		this.gizmos.push(new Character(this, 'gizmo', 304, 144, 5, 7, 3, layer));
	}

	private addGizmoColliders(char: Character, layer: Phaser.Tilemaps.TilemapLayer){
		this.gizmos.forEach(gizmo => {
			gizmo.addColiders(char.sprite);
			gizmo.addColiders(layer);
			this.physics.add.collider(gizmo.sprite, layer);
		})
	}

	
//#endregion PRIVATE FUNCTIONS
}