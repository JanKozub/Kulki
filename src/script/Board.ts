export default class Board {
    private stepArray: number[][] = [];

    public getBallAtCords(x: number, y: number): Element {
        return Board.getSquareWithCords(x, y)
            .getElementsByClassName('ball')[0]
    }

    public setFieldRed(x: number, y: number): void {
        Board.getSquareWithCords(x, y).style.backgroundColor = 'red'
    }

    public setPathGray(): void {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                let square = Board.getSquareWithCords(x, y);
                if (square.style.backgroundColor == 'red') {
                    square.style.backgroundColor = 'gray'
                }
            }
        }
    }

    public markField(x: number, y: number): void {
        this.stepArray[x][y] = 0;
        let c = 0;
        for (let n = 0; n < 81; n++) {
            for (let a = 0; a < 9; a++) {
                for (let b = 0; b < 9; b++) {
                    if (this.stepArray[a][b] == c) {
                        if (a > 0 && this.stepArray[a - 1][b] == -1) {
                            this.stepArray[a - 1][b] = c + 1;
                        }

                        if (b > 0 && this.stepArray[a][b - 1] == -1) {
                            this.stepArray[a][b - 1] = c + 1;
                        }

                        if (a < 8 && this.stepArray[a + 1][b] == -1) {
                            this.stepArray[a + 1][b] = c + 1;
                        }

                        if (b < 8 && this.stepArray[a][b + 1] == -1) {
                            this.stepArray[a][b + 1] = c + 1;
                        }
                    }
                }
            }
            c = c + 1
        }
    }

    public clearArray(array: number[][]): void {
        this.stepArray = []
        for (let x = 0; x < 9; x++) {
            let a = []
            for (let y = 0; y < 9; y++) {
                if (array[x][y] > -1) {
                    a.push(100)
                } else {
                    a.push(-1)
                }
            }
            this.stepArray.push(a)
        }
    }

    public clearPath(): void {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                Board.getSquareWithCords(x, y).style.backgroundColor = 'white'
            }
        }
    }

    public getStepArray(): number[][] {
        return this.stepArray;
    }

    public static getSquareWithCords(x: number, y: number): HTMLElement {
        return document.getElementById(x + 'x' + y)
    }

    public static removeBallFromArray(x: number, y: number, array: number[][]): number[][] {
        array[x][y] = -1;
        this.getSquareWithCords(x, y).innerHTML = ''
        return array;
    }
}