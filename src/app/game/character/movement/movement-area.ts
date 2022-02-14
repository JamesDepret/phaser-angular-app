import { Coordinate } from "src/app/utils/coordinate";

/**
 * Class used to show the calculate the movable area of the character
 */
export default class MovementArea {
    private counter = 0;
    private remainingSpeed: number = 0;
    private currentSpeedCoordinates: Coordinate[] = [];
    private nextSpeedCoordinates: Coordinate[] = [];
    private collectedCoordinates: Coordinate[] = [];
    private _currentMap : Phaser.Tilemaps.TilemapLayer;

    constructor(currentMap: Phaser.Tilemaps.TilemapLayer) {
        this._currentMap = currentMap;
    }

    //#region properties
    public set currentMap(v : Phaser.Tilemaps.TilemapLayer) {
        this._currentMap = v;
    }
    //#endregion properties
       
    calculateMovableCoordinates(currentCoordinate: Coordinate, speed: number): Coordinate[] {
        
        this.getCoordinates(speed,currentCoordinate);
        return this.collectedCoordinates;
    }

    private getCoordinates(speed: number, startingCoordinate: Coordinate){
        this.remainingSpeed = speed;
        this.collectedCoordinates = [{ x: startingCoordinate.x, y: startingCoordinate.y }];
        this.currentSpeedCoordinates = this.collectedCoordinates;
        while (this.remainingSpeed > 0 ){
            this.currentSpeedCoordinates.forEach(coord => {
                this.validateNextCoordinate({x: coord.x - 1, y: coord.y});
                this.validateNextCoordinate({x: coord.x + 1, y: coord.y});
                this.validateNextCoordinate({x: coord.x, y: coord.y - 1});
                this.validateNextCoordinate({x: coord.x, y: coord.y + 1});
            }); 
            this.remainingSpeed--;
            this.currentSpeedCoordinates = this.nextSpeedCoordinates;
            this.nextSpeedCoordinates = [];
        }
    }

    private validateNextCoordinate(coord: Coordinate){
        this.counter++;
        let newTile: Phaser.Tilemaps.Tile = this._currentMap.getTileAt(coord.x, coord.y);
        let tileInList = this.collectedCoordinates.find(c => c.x == coord.x && c.y == coord.y);
        if (newTile && !newTile.canCollide && !tileInList) {
            this.nextSpeedCoordinates.push(coord);
            this.collectedCoordinates.push(coord);
        }
    }
}