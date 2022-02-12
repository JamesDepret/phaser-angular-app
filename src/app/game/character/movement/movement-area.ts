import { Coordinate } from "src/app/utils/coordinate";

/**
 * Class used to show the calculate the movable area of the character
 */
export default class MovementArea {
    private movableCoordinates: Coordinate[] = [];
    private _currentMap : Phaser.Tilemaps.TilemapLayer;

    constructor(currentMap: Phaser.Tilemaps.TilemapLayer) {
        this._currentMap = currentMap;
    }

    //#region properties
    public get currentMap() : Phaser.Tilemaps.TilemapLayer {
        return this._currentMap;
    }
    public set currentMap(v : Phaser.Tilemaps.TilemapLayer) {
        this._currentMap = v;
    }
    //#endregion properties
       
    calculateMovableCoordinates(currentCoordinate: Coordinate, speed: number): Coordinate[] {
        this.movableCoordinates = [{ x: currentCoordinate.x, y: currentCoordinate.y, remainingSpeed: speed }];
        if (speed > 0) this.recursiveCoordinate(speed, currentCoordinate.x, currentCoordinate.y);
        return this.movableCoordinates;
    }

    private recursiveCoordinate(remainingSpeed: number, x: number, y: number) {
        this.validateCoordinate(x + 1, y, remainingSpeed);
        this.validateCoordinate(x - 1, y, remainingSpeed);
        this.validateCoordinate(x, y + 1, remainingSpeed);
        this.validateCoordinate(x, y - 1, remainingSpeed);
    }
    
    private validateCoordinate(x: number, y: number, remainingSpeed: number) {
        let newTile: Phaser.Tilemaps.Tile = this.currentMap.getTileAt(x, y);
        let tileInList = this.movableCoordinates.find(c => c.x == newTile.x && c.y == newTile.y);
        if (newTile && !newTile.canCollide && (remainingSpeed >= tileInList?.remainingSpeed! || !tileInList)) {
            if (!tileInList) {
                this.movableCoordinates.push({ x: x, y, remainingSpeed });
            } else {
                tileInList.remainingSpeed = remainingSpeed;
            }

            if (remainingSpeed - 1 > 0)
                this.recursiveCoordinate(remainingSpeed - 1, x, y);
        }
    }
}