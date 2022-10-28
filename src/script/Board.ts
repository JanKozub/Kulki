export class Board {
    /** array of steps from selected position */
    private stepArray: number[][] = [];

    /**
     * @param x first cord
     * @param y second cord
     * @returns HTMLElement of ball at given cords
     **/
    public getBallAtCords(x: number, y: number): Element {
        return Board.getSquareWithCords(x, y)
            .getElementsByClassName('ball')[0]
    }

    /**
     * Changes background color of square at given cords
     * @param x first cord
     * @param y second cord
     **/
    public setFieldRed(x: number, y: number): void {
        Board.getSquareWithCords(x, y).style.backgroundColor = 'red'
    }

    /**
     * Replaces red color of path with gray
     **/
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

    /**
     * Marks distance of squares in correlation to given cords
     * @param x first cord
     * @param y second cord
     **/
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

    /**
     * clears stepArray field
     * @param array array of balls on board
     **/
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

    /**
     * Clears all colors of squares on the board
     **/
    public clearPath(): void {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                Board.getSquareWithCords(x, y).style.backgroundColor = 'white'
            }
        }
    }

    /**
     * @param x first cord
     * @param y second cord
     * @returns HTMLElement of square on given cords
     **/
    public static getSquareWithCords(x: number, y: number): HTMLElement {
        return document.getElementById(x + 'x' + y)
    }

    /**
     * Removes ball from board and array variable
     * @param x first cord
     * @param y second cord
     * @param array array of balls on board
     * @returns array without the ball
     **/
    public static removeBallFromArray(x: number, y: number, array: number[][]): number[][] {
        array[x][y] = -1;
        this.getSquareWithCords(x, y).innerHTML = ''
        return array;
    }

    /**
     * checks if ball is blocked by other balls
     **/
    public static isBallNotBlocked(x: number, y: number, array: number[][]): boolean {
        return (x > 0 && array[x - 1][y] == -1) ||
            (x < 8 && array[x + 1][y] == -1) ||
            (y > 0 && array[x][y - 1] == -1) ||
            (y < 8 && array[x][y + 1] == -1);
    }

    /**
     * @returns array of steps from selected field
     **/
    public getStepArray(): number[][] {
        return this.stepArray;
    }
}