export default class TextBox  {
    
    private _speed : number;
    private _sprite : Phaser.Physics.Arcade.Sprite;
    private _hp : number;
    private _damage : number;
    private _currentYPosition : number;
    private _currentXPosition : number;

    constructor(sprite : Phaser.Physics.Arcade.Sprite, xPos: number, yPos: number, hp: number,  speed: number, damage: number) {
        this._hp = hp;
        this._sprite = sprite;
        this._speed = speed;
        this._damage = damage;
        this._currentXPosition = xPos;
        this._currentYPosition = yPos;
    }

    public get speed() : number {
        return this._speed;
    }
    public set speed(v : number) {
        this._speed = v;
    }
    
    public get sprite() : Phaser.Physics.Arcade.Sprite {
        return this._sprite;
    }
    public set sprite(v : Phaser.Physics.Arcade.Sprite) {
        this._sprite = v;
    }
    
    public get hp() : number {
        return this._hp;
    }
    public set hp(v : number) {
        this._hp = v;
    }

    
    public get damage() : number {
        return this._damage;
    }
    public set damage(v : number) {
        this._damage = v;
    }
    
    
    public get currentXPosition() : number {
        return this._currentXPosition;
    }
    public set currentXPosition(v : number) {
        this._currentXPosition = v;
    }
    
    public get currentYPosition() : number {
        return this._currentYPosition;
    }
    public set currentYPosition(v : number) {
        this._currentYPosition = v;
    }
    
    public moveCharacter(xTiles: number, yTiles: number){
    }

    public showMoveement(scene: Phaser.Scene) {
        //let bmd = scene.add.bitmapData(game.width, game.height)
        //bmd.ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    }
    
}