import {Utils} from './Utils';
import Board from "./Board";
import Striker from "./Striker";
import Cords from "./Cords";

class Game {
    private array: number[][] = [];
    private stepArr: number[][] = [];
    private readonly colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue', 'pink'];
    private currentField: Cords = {x: -1, y: -1};
    private lastField: Cords = {x: 0, y: 0};
    private startField: Cords = {x: 0, y: 0};
    private nextBalls: number[] = [];
    private locker = false;
    private noPath = false;
    private coolDown = false;
    private readonly mainEl: HTMLElement = undefined;
    private readonly striker: Striker;

    constructor() {
        this.mainEl = document.getElementById('main');
        this.nextBalls = Utils.drawBalls(3)
        this.initBoard();
        this.drawNextBalls();

        this.striker = new Striker();
    }

    private initBoard(): void {
        for (let x = 0; x < 9; x++) {
            let a = []
            for (let y = 0; y < 9; y++) {
                this.createSquare(x, y);
                a.push(-1)
            }
            this.array.push(a)
        }
    }

    private drawNextBalls(): void {
        for (let i = 0; i < 3; i++) {
            let nextCords = Utils.findFreeCords(this.array);

            this.createBall(this.nextBalls[i], nextCords.x, nextCords.y);
            this.array[nextCords.x][nextCords.y] = this.nextBalls[i];
        }

        this.nextBalls = []
        let nextBalls = document.getElementById('next-balls');
        nextBalls.innerHTML = ''
        for (let i = 0; i < 3; i++) {
            let colorNum = Utils.getRandomColorNum()
            this.nextBalls.push(colorNum)
            let ball = document.createElement('div')
            ball.className = 'ball'
            ball.style.marginLeft = '5px'
            ball.style.marginRight = '5px'
            ball.style.backgroundColor = this.colors[colorNum]
            nextBalls.append(ball)
        }
    }

    private makeRedPath(): void {
        if (this.doesFieldChanged()) {
            this.noPath = false;

            let num = this.stepArr[this.currentField.x][this.currentField.y];
            if (num !== -1 && num < 90) {
                Board.clearPath();
                Board.setFieldRed(this.currentField.x, this.currentField.y)

                let fields = this.currentField;
                while (num > 0) {
                    for (let i = -1; i <= 1; i++) {
                        for (let k = -1; k <= 1; k++) {
                            let a = fields.x - i;
                            let b = fields.y - k;

                            if (a >= 0 && b >= 0 && a <= 8 && b <= 8) {
                                if ((i == -1 && k == 0) || (i == 1 && k == 0) || (i == 0)) {
                                    if (this.stepArr[a][b] <= num) {
                                        num = this.stepArr[a][b];
                                        fields = {x: a, y: b}
                                        Board.setFieldRed(a, b)
                                        this.noPath = false;
                                    }
                                }
                            }
                        }
                    }
                }
                this.lastField = this.currentField;
            } else {
                this.noPath = true;
            }
        }
    }

    private markField(x: number, y: number): void {
        this.stepArr[x][y] = 0;
        let c = 0;
        for (let n = 0; n < 81; n++) {
            for (let a = 0; a < 9; a++) {
                for (let b = 0; b < 9; b++) {
                    if (this.stepArr[a][b] == c) {
                        if (a > 0 && this.stepArr[a - 1][b] == -1) {
                            this.stepArr[a - 1][b] = c + 1;
                        }

                        if (b > 0 && this.stepArr[a][b - 1] == -1) {
                            this.stepArr[a][b - 1] = c + 1;
                        }

                        if (a < 8 && this.stepArr[a + 1][b] == -1) {
                            this.stepArr[a + 1][b] = c + 1;
                        }

                        if (b < 8 && this.stepArr[a][b + 1] == -1) {
                            this.stepArr[a][b + 1] = c + 1;
                        }
                    }
                }
            }
            c = c + 1
        }
    }

    private createBall(colorNum: number, x: number, y: number): void {
        let ball = document.createElement('div')
        ball.className = 'ball'
        ball.style.backgroundColor = this.colors[colorNum]

        ball.onclick = () => {
            if (this.ballIsNotBlocked(x, y)) {
                if (!this.locker) {
                    this.startField = {x: x, y: y}
                    Utils.setBallSize(ball, 'big')
                    this.clearArray();
                    this.markField(x, y);
                    this.mainEl.onmousemove = () => this.makeRedPath()
                    this.locker = true;
                } else {
                    if (this.startField.x == x && this.startField.y == y) {
                        Utils.setBallSize(ball, 'small')
                        this.mainEl.onmousemove = undefined;
                        Board.clearPath();
                        this.lastField = {x: 0, y: 0}
                        this.locker = false;
                    }
                }
            }
        }
        let square = Board.getSquareWithCords(x, y)
        square.innerHTML = ''
        square.append(ball)
    }

    private createSquare(x: number, y: number): void {
        let square = document.createElement('div')
        square.id = x + 'x' + y
        square.className = 'square'
        square.style.left = (y * 52) + 'px'
        square.style.top = (x * 52) + 'px'
        square.onmouseover = () => this.currentField = {x: x, y: y}

        square.onclick = () => {
            if (!this.noPath) {
                if (this.locker && this.array[x][y] == -1 && !this.coolDown) {
                    this.array[x][y] = this.array[this.startField.x][this.startField.y]
                    this.array = Board.removeBallFromArray(this.startField.x, this.startField.y, this.array);
                    this.createBall(this.array[x][y], x, y);
                    this.mainEl.onmousemove = undefined;
                    this.lastField = {x: 0, y: 0}

                    this.coolDown = true;
                    Board.setPathGray();
                    setTimeout(() => {
                        if (this.striker.strikeBalls(x, y, this.array) == 0) {
                            this.drawNextBalls();
                        }

                        Board.clearPath()
                        this.locker = false;
                        this.coolDown = false;
                    }, 1000)
                }
            } else {
                let targetBall = Board.getBallAtCords(x, y);
                if (targetBall !== undefined) {
                    Board.clearPath();
                    let startBall = Board.getBallAtCords(this.startField.x, this.startField.y);
                    Utils.setBallSize(<HTMLElement>startBall, 'small')
                    Utils.setBallSize(<HTMLElement>targetBall, 'big')
                    this.lastField = {x: 0, y: 0}
                    this.startField = {x: x, y: y}
                    this.clearArray();
                    this.markField(x, y);
                }
            }
        }
        this.mainEl.append(square)
    }

    private clearArray(): void {
        this.stepArr = []
        for (let x = 0; x < 9; x++) {
            let a = []
            for (let y = 0; y < 9; y++) {
                if (this.array[x][y] > -1) {
                    a.push(100)
                } else {
                    a.push(-1)
                }
            }
            this.stepArr.push(a)
        }
    }

    private doesFieldChanged(): boolean {
        return (this.currentField.x != this.lastField.x || this.currentField.y != this.lastField.y)
    }

    private ballIsNotBlocked(x: number, y: number): boolean {
        return (x > 0 && this.array[x - 1][y] == -1) ||
            (x < 8 && this.array[x + 1][y] == -1) ||
            (y > 0 && this.array[x][y - 1] == -1) ||
            (y < 8 && this.array[x][y + 1] == -1);
    }
}

new Game()
