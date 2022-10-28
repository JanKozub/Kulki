import {Cords} from "./interfaces/Cords";

/**
 * Class witch contains only static methods for basic calculations or simple static elements update/replacement.
 */
export class Utils {

    /**
     * Adds given points to current value in HTML.
     * @param points number of points to be added to current value
     */
    public static addPoints(points: number): void {
        let pointsEl = document.getElementById('points');
        pointsEl.innerText = String(parseInt(pointsEl.innerText) + points)
    }

    /**
     * Draws random number of color.
     * @returns number of color in array
     */
    public static getRandomColorNum(): number {
        return Math.round(Math.random() * 6)
    }

    /**
     * Sets size of given ball on the board.
     * @param ball HTML element of ball to be resized
     * @param size either 'small' or 'bit' value is accepted
     */
    public static setBallSize(ball: HTMLElement, size: string): void {
        if (size == 'big') {
            ball.style.width = '46px'
            ball.style.height = '46px'
            ball.style.top = '1px'
            ball.style.left = '1px'
        } else if (size == 'small') {
            ball.style.width = '36px'
            ball.style.height = '36px'
            ball.style.top = '6px'
            ball.style.left = '6px'
        }
    }

    /**
     * Draws some amount of numbers which correlate to colors in array.
     * @param amount number of balls to be drawn
     * @returns array of numbers correlating to array
     */
    public static drawBalls(amount: number): number[] {
        let balls: number[] = []
        for (let i = 0; i < amount; i++) {
            balls.push(Utils.getRandomColorNum())
        }
        return balls;
    }

    /**
     * Finds free spot on the board.
     * @param array array of free squares on the board
     * @returns coordinates of free square
     */
    public static findFreeCords(array: number[][]): Cords {
        let x = -1;
        let y = -1;
        if (!this.isArrayFull(array)) {
            while (true) {
                x = Math.round(Math.random() * 8)
                y = Math.round(Math.random() * 8)

                if (array[x][y] == -1)
                    break;
            }
        } else {
            this.FinishGame();
        }
        return {x: x, y: y}
    }

    /**
     * Checks if array is full.
     * @param array array of free squares on the board
     */
    private static isArrayFull(array: number[][]): boolean {
        let counter = 0;
        for (let i = 0; i < 9; i++) {
            for (let k = 0; k < 9; k++) {
                if (array[i][k] == -1) {
                    counter++;
                }
            }
        }
        return counter == 1;
    }

    /**
     * Deletes all elements from HTML and displays information about points gathered.
     */
    private static FinishGame(): void {
        document.body.innerHTML = `<p>Przegrales! Zdobyłeś ${document.getElementById('points').innerHTML} punktów!</p>`
    }
}
