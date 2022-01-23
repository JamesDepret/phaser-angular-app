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
        this.load.atlas('bowie','assets/character/bowie/bowie.png','assets/character/bowie/bowie.json');

        this.load.image('fight1','assets/ui/fight1.png');
        this.load.image('fight2','assets/ui/fight2.png');
        this.load.image('cast1','assets/ui/cast1.png');
        this.load.image('cast2','assets/ui/cast2.png');
        this.load.image('items1','assets/ui/items1.png');
        this.load.image('items2','assets/ui/items2.png');
        this.load.image('stop1','assets/ui/stop1.png');
        this.load.image('stop2','assets/ui/stop2.png');
    }

    create()
    {
        this.scene.start('game');
    }
}