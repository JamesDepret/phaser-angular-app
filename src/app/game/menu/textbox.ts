export default class TextBox  {
    scene: Phaser.Scene;
    rects: Phaser.GameObjects.Graphics[];
    mask!: Phaser.Display.Masks.GeometryMask;
    text!: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.rects = [];
    }

    public textBox(x: number, y: number, width: number, height: number, content: string){
        this.removeTextbox();
        var graphics = this.scene.make.graphics({
            x: 0,
            y: 0,
            add: true
        });
        graphics.fillStyle(0x874a00);
        this.rects.push(graphics.fillRect(x, y, width, height));
        graphics.fillStyle(0xf4d648);
        this.rects.push(graphics.fillRect(x+2, y+2, width-4, height-4));
        graphics.fillStyle(0xfffed8);
        this.rects.push(graphics.fillRect(x+4, y+4, width-8, height-8));
        graphics.fillStyle(0x794a2f);
        this.rects.push(graphics.fillRect(x+6, y+6, width-12, height-12));
        graphics.fillStyle(0x002590);
        this.rects.push(graphics.fillRect(x+8, y+8, width-16, height-16));
        
        this.mask = new Phaser.Display.Masks.GeometryMask(this.scene, graphics);
        this.text = this.scene.add.text(x+16, y+16, content, { fontFamily: 'Arial', color: '#ffffff', wordWrap: { width: width-64 }  }).setOrigin(0);

        
        this.text.setMask(this.mask);
    }

    public removeTextbox(){
        this.rects.forEach(rect => {
            rect.destroy();
        });
        this.rects = [];
        if(this.text) this.text.destroy();
        if(this.mask) this.mask.destroy();
    }
}