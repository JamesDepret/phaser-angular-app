import { createAnimation } from "src/app/utils/anim";
import { sprite } from "./sprite/sprite";
import TextBox from "./textbox";


export default class BaseMenu {
    protected MENUPOSITION = { width: 0 ,height: 0}
    protected LEFT: sprite = { name: 'cast', spriteBody: undefined, xPosition: 0, yPosition:0 };
    protected UP: sprite = { name: 'fight', spriteBody: undefined, xPosition: 24, yPosition:-12 };
    protected DOWN: sprite = { name: 'stop', spriteBody: undefined, xPosition: 24, yPosition:12 };
    protected RIGHT: sprite = { name: 'items', spriteBody: undefined, xPosition: 48, yPosition:0 };
    protected TEXTBOX: TextBox;
    protected selectedOption: string = '';

    protected scene!: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        let { width, height } = this.scene.sys.game.canvas;
        this.MENUPOSITION.width = width / 2 - 48;
        this.MENUPOSITION.height = height - 64;
        this.TEXTBOX = new TextBox(scene);
    }

    public toggleMenu(display: boolean){
        if(display) {
            this.createMenu(this.UP);
            this.createMenu(this.LEFT);
            this.createMenu(this.RIGHT);
            this.createMenu(this.DOWN);   
        } else {
            this.UP.spriteBody?.destroy();
            this.LEFT.spriteBody?.destroy();
            this.RIGHT.spriteBody?.destroy();
            this.DOWN.spriteBody?.destroy();
            this.TEXTBOX.removeTextbox();
        }
    }

    public cursorInput(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
        if(cursor.left?.isDown){
            this.playAnimation(this.LEFT.name);
        } 
        else if (cursor.right?.isDown) {
            this.playAnimation(this.RIGHT.name);
        } 
        else if(cursor.down?.isDown){
            this.playAnimation(this.DOWN.name);
        } 
        else if (cursor.up?.isDown) {
            this.playAnimation(this.UP.name);
        }
    }

    protected playAnimation(anim: string) {
        this.StopAnimation(this.UP);
        this.StopAnimation(this.DOWN);
        this.StopAnimation(this.LEFT);
        this.StopAnimation(this.RIGHT);

        if(anim == this.UP.name){ 
            this.addTextBox(this.UP.name);
            this.UP.spriteBody!.play(this.UP.name); 
            this.selectedOption = this.UP.name;
        } else if(anim == this.LEFT.name){ 
            this.addTextBox(this.LEFT.name);
            this.LEFT.spriteBody!.play(this.LEFT.name); 
            this.selectedOption = this.LEFT.name;
        } else if(anim == this.DOWN.name){ 
            this.addTextBox(this.DOWN.name);
            this.DOWN.spriteBody!.play(this.DOWN.name); 
            this.selectedOption = this.DOWN.name;
        }  else if(anim == this.RIGHT.name){ 
            this.addTextBox(this.RIGHT.name);
            this.RIGHT.spriteBody!.play(this.RIGHT.name);
            this.selectedOption = this.RIGHT.name;
        }
    }

    private addTextBox(name: string){
        this.TEXTBOX.textBox(this.MENUPOSITION.width + 100, this.MENUPOSITION.height-24,100, 48, name);
    }

    private StopAnimation(sprite: sprite){
        sprite.spriteBody!.setFrame(0);
        sprite.spriteBody!.stop();
    }
    
	protected createMenu(menu: sprite) {
		menu.spriteBody = this.scene.physics.add.sprite(menu.xPosition + this.MENUPOSITION.width , menu.yPosition + this.MENUPOSITION.height, menu.name, menu.name +'1.png');
		createAnimation(this.scene,menu.name, '',1,2);
	}

}