export default class Board {
    public static getSquareWithCords(x: number, y: number): HTMLElement {
        return document.getElementById(x + 'x' + y)
    }

    public static getBallAtCords(x: number, y: number): Element {
        return this.getSquareWithCords(x, y)
            .getElementsByClassName('ball')[0]
    }

    public static setFieldRed(x: number, y: number): void {
        Board.getSquareWithCords(x, y).style.backgroundColor = 'red'
    }

    public static setPathGray(): void {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                let square = Board.getSquareWithCords(x, y);
                if (square.style.backgroundColor == 'red') {
                    square.style.backgroundColor = 'gray'
                }
            }
        }
    }

    public static removeBallFromArray(x: number, y: number, array: number[][]): number[][] {
        array[x][y] = -1;
        Board.getSquareWithCords(x, y).innerHTML = ''
        return array;
    }

    public static clearPath(): void {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                Board.getSquareWithCords(x, y).style.backgroundColor = 'white'
            }
        }
    }
}