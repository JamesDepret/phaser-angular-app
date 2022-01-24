import { createAnimation } from "src/app/utils/anim";
import { sprite } from "./sprite/sprite";


export default class CombatMenu {
    private MENU!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private CONTAINERPOSITION = { width: 0 ,height: 0}
    private CAST: sprite = { name: 'cast', spriteBody: undefined, xPosition: 0, yPosition:0 };
    private FIGHT: sprite = { name: 'fight', spriteBody: undefined, xPosition: 24, yPosition:-12 };
    private STOP: sprite = { name: 'stop', spriteBody: undefined, xPosition: 24, yPosition:12 };
    private ITEMS: sprite = { name: 'items', spriteBody: undefined, xPosition: 48, yPosition:0 };

    private container!: Phaser.GameObjects.Container;
    private scene!: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        let { width, height } = this.scene.sys.game.canvas;
        this.CONTAINERPOSITION.width = width / 2 - 48;
        this.CONTAINERPOSITION.height = height - 64;
    }

    toggleMenu(condition: boolean){
        if(condition) {
            this.createMenu(this.FIGHT);
            this.createMenu(this.CAST);
            this.createMenu(this.ITEMS);
            this.createMenu(this.STOP);
        }
        else {
            this.FIGHT.spriteBody?.destroy();
            this.CAST.spriteBody?.destroy();
            this.ITEMS.spriteBody?.destroy();
            this.STOP.spriteBody?.destroy();
        }
    }

    cursorInput(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
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

    playAnimation(anim: string) {
        this.FIGHT.spriteBody!.stop();
        this.CAST.spriteBody!.stop();
        this.ITEMS.spriteBody!.stop();
        this.STOP.spriteBody!.stop();

        if(anim == this.FIGHT.name){ 
            this.FIGHT.spriteBody!.play(this.FIGHT.name); 
        } else if(anim == this.CAST.name){ 
            this.CAST.spriteBody!.play(this.CAST.name); 
        } else if(anim == this.STOP.name){ 
            this.STOP.spriteBody!.play(this.STOP.name); 
        }  else if(anim == this.ITEMS.name){ 
            this.ITEMS.spriteBody!.play(this.ITEMS.name); 
        }
    }
    
	private createMenu(menu: sprite) {
		menu.spriteBody = this.scene.physics.add.sprite(menu.xPosition + this.CONTAINERPOSITION.width , menu.yPosition + this.CONTAINERPOSITION.height, menu.name, menu.name +'1.png');
		createAnimation(this.scene,menu.name, '',1,2);
	}
}