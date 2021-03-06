import Phaser from "phaser";

export default class Preloader extends Phaser.Scene 
{
    constructor() {
        super('preloader');
    }
    // image pre loading
    preload() 
    {
        this.load.image('tiles','assets/tiles/stordarth-tiles.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/tilemap/dungeon1.json');
        this.load.atlas('bowie','assets/character/bowie/bowie.png','assets/character/bowie/bowie.json');
        this.load.atlas('gizmo','assets/enemies/gizmo/gizmo.png','assets/enemies/gizmo/gizmo.json');

        
        this.load.atlas('fight','assets/ui/fight.png','assets/ui/fight.json');
        this.load.atlas('cast','assets/ui/cast.png','assets/ui/cast.json');
        this.load.atlas('items','assets/ui/items.png','assets/ui/items.json');
        this.load.atlas('stop','assets/ui/stop.png','assets/ui/stop.json');
    }

    create()
    {
        this.scene.start('game');
    }
}