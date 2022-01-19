import Phaser from "phaser";

export default class Preloader extends Phaser.Scene 
{
    constructor() {
        super('preloader');
    }

    preload() 
    {
        this.load.image('tiles','assets/tiles/stordarth-tiles.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/tilemap/dungeon1.json');
    }

    create()
    {
        this.scene.start('game');
    }
}