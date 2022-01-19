import Phaser from 'phaser';

enum Tile
{
	Grass = 125,
	Grass2 = 96,
	WallTopLeft = 61,
	WallTopRight = 65,
	WallTop = 63,
	WallTop2 = 62,
	WallRight = 123,
	WallRight2 = 152,
	WallRight3 = 94,
	WallLeft = 119,
	WallLeft2 = 148,
	WallBody = 149,
	WallBody2 = 351,
	WallBody3 = 178,
	WallBotLeft = 206,
	WallBottom = 438,
	WallBottom2 = 380,
	WallBottom3 = 207,
	WallBotRight = 210,
}

const TILE_SIZE = 32

function tileToWorld(value: number)
{
	return (value * TILE_SIZE) + (TILE_SIZE * 0.5)
}

function worldToTile(value: number)
{
	return Math.floor(value / TILE_SIZE)
}

function alignToGrid(value: number)
{
	return tileToWorld(worldToTile(value))
}
export class MainScene extends Phaser.Scene {
    constructor() {
      super({ key: 'game' });
    }

    create() {
        const map = this.make.tilemap({key: 'dungeon'});
        const tileset = map.addTilesetImage('dungeon', 'tiles');

        const groundLayer = map.createLayer('ground', tileset);
        //map.createLayer('upper', tileset);
        groundLayer.setCollisionByProperty({ collides: true });

        const debugGraphics = this.add.graphics().setAlpha(0.75);
        groundLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
    }


    
    override update() {
    }
}