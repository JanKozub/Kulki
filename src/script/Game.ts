import {Utils} from './Utils';
import {Board} from "./Board";
import {Striker} from "./Striker";
import {Cords} from "./interfaces/Cords";

/**
 * Main file of the project. Assembles all elements of the game
 */
export class Game {
    /** array of ball positions on the board */
    private array: number[][] = [];
    /** array of available colors */
    private readonly colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue', 'pink'];
    /** cords of current mouse position on the board */
    private currentField: Cords = {x: -1, y: -1};
    /** cords of field that was previously selected */
    private lastField: Cords = {x: 0, y: 0};
    /** cords of field that the red mark started from */
    private startField: Cords = {x: 0, y: 0};
    /** array of balls that will be added on next move */
    private nextBalls: number[] = [];
    /** locks mouse left button for time of coolDown */
    private locker = false;
    /** current status of available route to destination */
    private noPath = false;
    /** locks game for the time of coolDown */
    private coolDown = false;
    /** main board HTML element */
    private readonly mainEl: HTMLElement = undefined;
    /** striker class */
    private readonly striker: Striker;
    /** board class */
    private readonly board: Board;

    constructor() {
        this.striker = new Striker();
        this.board = new Board();

        this.mainEl = document.getElementById('main');
        this.nextBalls = Utils.drawBalls(3)
        this.initBoard();
        this.drawNextBalls();
    }

    /**
     * Creates board in HTML and initiates the array variable
     **/
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

    /**
     * adds balls to the board and draws three next balls
     **/
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

    /**
     * makes red path of the fastest way to the target
     **/
    private makeRedPath(): void {
        this.noPath = false;

        let num = this.board.getStepArray()[this.currentField.x][this.currentField.y];
        if (num !== -1 && num < 90) {
            this.board.clearPath();
            this.board.setFieldRed(this.currentField.x, this.currentField.y)

            let fields = this.currentField;
            while (num > 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let k = -1; k <= 1; k++) {
                        let a = fields.x - i;
                        let b = fields.y - k;

                        if (a >= 0 && b >= 0 && a <= 8 && b <= 8) {
                            if ((i == -1 && k == 0) || (i == 1 && k == 0) || (i == 0)) {
                                if (this.board.getStepArray()[a][b] <= num) {
                                    num = this.board.getStepArray()[a][b];
                                    fields = {x: a, y: b}
                                    this.board.setFieldRed(a, b)
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

    /**
     * creates HTML ball element with all necessary mouse events
     **/
    private createBall(colorNum: number, x: number, y: number): void {
        let ball = document.createElement('div')
        ball.className = 'ball'
        ball.style.backgroundColor = this.colors[colorNum]

        ball.onclick = () => {
            if (Board.isBallNotBlocked(x, y, this.array)) {
                if (!this.locker) {
                    this.startField = {x: x, y: y}
                    Utils.setBallSize(ball, 'big')
                    this.board.clearArray(this.array);
                    this.board.markField(x, y);
                    this.mainEl.onmousemove = () => {
                        if (this.doesFieldChanged()) {
                            this.makeRedPath()
                        }
                    }
                    this.locker = true;
                } else {
                    if (this.startField.x == x && this.startField.y == y) {
                        Utils.setBallSize(ball, 'small')
                        this.mainEl.onmousemove = undefined;
                        this.board.clearPath();
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

    /**
     * creates HTML square element with all necessary mouse events
     **/
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
                    this.board.setPathGray();
                    setTimeout(() => {
                        if (this.striker.strikeBalls(x, y, this.array) == 0) {
                            this.drawNextBalls();
                        }

                        this.board.clearPath()
                        this.locker = false;
                        this.coolDown = false;
                    }, 1000)
                }
            } else {
                let targetBall = this.board.getBallAtCords(x, y);
                if (targetBall !== undefined) {
                    this.board.clearPath();
                    let startBall = this.board.getBallAtCords(this.startField.x, this.startField.y);
                    Utils.setBallSize(<HTMLElement>startBall, 'small')
                    Utils.setBallSize(<HTMLElement>targetBall, 'big')
                    this.lastField = {x: 0, y: 0}
                    this.startField = {x: x, y: y}
                    this.board.clearArray(this.array);
                    this.board.markField(x, y);
                }
            }
        }
        this.mainEl.append(square)
    }

    /**
     * checks if mouse position changed in relation to last mouse move
     **/
    private doesFieldChanged(): boolean {
        return (this.currentField.x != this.lastField.x || this.currentField.y != this.lastField.y)
    }
}

new Game()
