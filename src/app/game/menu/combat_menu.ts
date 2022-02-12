import { ENDTURN } from "src/app/utils/constants";
import BaseMenu from "./base_menu";

export default class CombatMenu extends BaseMenu {
    queueNumber: number;
    endTurn: boolean = false;
    constructor(scene: Phaser.Scene, queueNumber: number) {
        super(scene);
        this.scene = scene;
        let { width, height } = this.scene.sys.game.canvas;
        this.MENUPOSITION.width = width / 2 - 48;
        this.MENUPOSITION.height = height - 64;
        this.queueNumber = queueNumber;

        
        this.LEFT = { name: 'cast', spriteBody: undefined, xPosition: 0, yPosition:0 };
        this.UP = { name: 'fight', spriteBody: undefined, xPosition: 24, yPosition:-12 };
        this.DOWN = { name: 'stop', spriteBody: undefined, xPosition: 24, yPosition:12 };
        this.RIGHT = { name: 'items', spriteBody: undefined, xPosition: 48, yPosition:0 };
    }

    public toggleCombatMenu(condition: boolean, EnemyNear: boolean): void {
        super.toggleMenu(condition);
        if (condition && !EnemyNear) {
            this.playAnimation(this.DOWN.name);
        } else if (condition) {
            this.playAnimation(this.UP.name);
        }
    }
    public override cursorInput(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
        if(!this.endTurn){
            super.cursorInput(cursor);
            if(cursor.shift?.isDown){
                if(this.DOWN.name == this.selectedOption){
                    this.scene.events.emit(ENDTURN, this.queueNumber);
                    this.setEndTurn(true);   
                    this.toggleMenu(false);
                }
            }
        }
    }
    public setEndTurn(state: boolean){
        this.endTurn = state;
    }
}