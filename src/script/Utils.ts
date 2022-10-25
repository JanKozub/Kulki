import Cords from "./Cords";

export default class Utils {
    public static addPoints(points: number): void {
        let pointsEl = document.getElementById('points');
        pointsEl.innerText = String(parseInt(pointsEl.innerText) + points)
    }

    public static getRandomColorNum(): number {
        return Math.round(Math.random() * 7)
    }

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

    public static drawBalls(amount: number): number[] {
        let balls: number[] = []
        for (let i = 0; i < amount; i++) {
            balls.push(Utils.getRandomColorNum())
        }
        return balls;
    }

    public static findFreeCords(array: number[][]): Cords {
        let x = 0;
        let y = 0;
        while (true) {
            x = Math.round(Math.random() * 8)
            y = Math.round(Math.random() * 8)

            if (array[x][y] == -1)
                break;
        }
        return {x: x, y: y}
    }
}
