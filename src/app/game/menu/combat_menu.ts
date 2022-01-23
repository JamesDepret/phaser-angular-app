import { sprite } from "./sprite/sprite";


export default class CombatMenu {
    private MENU!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private CAST: sprite = { name: 'cast', spriteBody: undefined, xPosition: 24, yPosition:-12 };
    private FIGHT: sprite = { name: 'fight', spriteBody: undefined, xPosition: 0, yPosition:0 };
    private STOP: sprite = { name: 'stop', spriteBody: undefined, xPosition: 48, yPosition:0 };
    private ITEMS: sprite = { name: 'items', spriteBody: undefined, xPosition: 24, yPosition:12 };

    private container!: Phaser.GameObjects.Container;
    private scene!: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.createMenu(this.FIGHT);
        this.createMenu(this.CAST);
        this.createMenu(this.ITEMS);
        this.createMenu(this.STOP);
    }

    toggleMenu(condition: boolean){
        if(condition) {
            this.createContainer()
        }
        else {
            if(this.container) this.container.destroy()
        }
    }

    cursorInput(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
        if (this.container){
			if(cursor.left?.isDown){
                this.playAnimation(this.CAST.name);
			} 
			else if (cursor.right?.isDown) {
                this.playAnimation(this.ITEMS.name);
			} 
			else if(cursor.down?.isDown){
                this.playAnimation(this.STOP.name);
			} 
			else if (cursor.up?.isDown) {
                this.playAnimation(this.FIGHT.name);
			}
        }
    }

    playAnimation(anim: string) {
        this.FIGHT.spriteBody!.stop();
        this.CAST.spriteBody!.stop();
        this.ITEMS.spriteBody!.stop();
        this.STOP.spriteBody!.stop();

        if(anim == this.FIGHT.name){ this.FIGHT.spriteBody!.play(this.FIGHT.name); } 
        else if(anim == this.CAST.name){ this.CAST.spriteBody!.play(this.CAST.name); } 
        else if(anim == this.STOP.name){ this.STOP.spriteBody!.play(this.STOP.name); } 
        else if(anim == this.ITEMS.name){ this.ITEMS.spriteBody!.play(this.ITEMS.name); }
    }
    
	private createMenu(menu: sprite) {
		menu.spriteBody = this.scene.physics.add.sprite(menu.xPosition , menu.yPosition, menu.name, menu.name +'1.png');
		createAnimation(this.scene,menu.name,1,2);
	}

    private createContainer(){
        var fight = this.scene.add.image(this.FIGHT.xPosition, this.FIGHT.yPosition, this.FIGHT.name + '1');
        var cast = this.scene.add.image(this.CAST.xPosition, this.CAST.yPosition, this.CAST.name + '1');
        var item = this.scene.add.image(this.ITEMS.xPosition, this.ITEMS.yPosition, this.CAST.name + '1');
        var stand = this.scene.add.image(this.STOP.xPosition, this.STOP.yPosition, this.STOP.name + '1');
        let { width, height } = this.scene.sys.game.canvas;
        this.container = this.scene.add.container( width / 2 - 48, height - 64, [fight, cast, item, stand]);
    }
}