import BaseMenu from "./base_menu";

export default class CombatMenu extends BaseMenu {
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene;
        let { width, height } = this.scene.sys.game.canvas;
        this.MENUPOSITION.width = width / 2 - 48;
        this.MENUPOSITION.height = height - 64;

        
        this.LEFT = { name: 'cast', spriteBody: undefined, xPosition: 0, yPosition:0 };
        this.UP = { name: 'fight', spriteBody: undefined, xPosition: 24, yPosition:-12 };
        this.DOWN = { name: 'stop', spriteBody: undefined, xPosition: 24, yPosition:12 };
        this.RIGHT = { name: 'items', spriteBody: undefined, xPosition: 48, yPosition:0 };
    }

    public toggleCombatMenu(condition: boolean, EnemyNear: boolean): void {
        super.toggleMenu(condition);
        if (condition && !EnemyNear) {
            this.DOWN.spriteBody!.play(this.DOWN.name);
        } else if (condition) {
            this.UP.spriteBody!.play(this.UP.name);
        }
    }
}