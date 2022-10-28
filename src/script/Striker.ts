import {Cords} from "./interfaces/Cords";
import {Utils} from "./Utils";
import Board from "./Board";
import {Color} from "./interfaces/Color";

/**
 * Class witch contains only static methods for basic calculations or simple static elements update/replacement.
 */
export default class Striker {
    private readonly minStrikeSize = 5;

    public strikeBalls(x: number, y: number, array: number[][]): number {
        let color = {index: array[x][y]}
        let result: Cords[] = []
        result = result.concat(this.checkVertical(x, y, color, array));
        result = result.concat(this.checkHorizontal(x, y, color, array));
        result = result.concat(this.checkDiagonal1(x, y, color, array));
        result = result.concat(this.checkDiagonal2(x, y, color, array));

        if (result.length > 0) {
            result.push({x: x, y: y})
        }

        Utils.addPoints(result.length)
        result.forEach((o) => {
            array = Board.removeBallFromArray(o.x, o.y, array)
        })
        return result.length;
    }

    private checkVertical(x: number, y: number, color: Color, array: number[][]): Cords[] {
        let result = [];
        let x2 = x - 1;
        while (x2 >= 0) {
            if (array[x2][y] == color.index) {
                result.push({x: x2, y: y});
            } else {
                break;
            }
            x2--;
        }
        x2 = x + 1;
        while (x2 < 9) {
            if (array[x2][y] == color.index) {
                result.push({x: x2, y: y});
            } else {
                break;
            }
            x2++;
        }

        if (result.length < this.minStrikeSize - 1) {
            result = []
        }
        return result
    }

    private checkHorizontal(x: number, y: number, color: Color, array: number[][]): Cords[] {
        let result = [];
        let y2 = y - 1;
        while (y2 >= 0) {
            if (array[x][y2] == color.index) {
                result.push({x: x, y: y2});
            } else {
                break;
            }
            y2--;
        }
        y2 = y + 1;
        while (y2 < 9) {
            if (array[x][y2] == color.index) {
                result.push({x: x, y: y2});
            } else {
                break;
            }
            y2++;
        }
        if (result.length < this.minStrikeSize - 1) {
            result = []
        }
        return result
    }

    private checkDiagonal1(x: number, y: number, color: Color, array: number[][]): Cords[] {
        let result = [];
        let x2 = x - 1;
        let y2 = y - 1;
        while (x2 >= 0 && y2 >= 0) {
            if (array[x2][y2] == color.index) {
                result.push({x: x2, y: y2});
            } else {
                break;
            }
            x2--;
            y2--;
        }
        x2 = x + 1;
        y2 = y + 1;
        while (x2 < 9 && y2 < 9) {
            if (array[x2][y2] == color.index) {
                result.push({x: x2, y: y2});
            } else {
                break;
            }
            x2++;
            y2++;
        }

        if (result.length < this.minStrikeSize - 1) {
            result = []
        }
        return result
    }

    private checkDiagonal2(x: number, y: number, color: Color, array: number[][]): Cords[] {
        let result = [];
        let x2 = x - 1;
        let y2 = y + 1;
        while (x2 >= 0 && y2 < 9) {
            if (array[x2][y2] == color.index) {
                result.push({x: x2, y: y2});
            } else {
                break;
            }
            x2--;
            y2++;
        }

        x2 = x + 1;
        y2 = y - 1;
        while (x2 < 9 && y2 >= 0) {
            if (array[x2][y2] == color.index) {
                result.push({x: x2, y: y2});
            } else {
                break;
            }
            x2++;
            y2--;
        }

        if (result.length < this.minStrikeSize - 1) {
            result = []
        }
        return result
    }
}