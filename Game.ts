class Game {
    private array = [];
    private stepArr = [];
    private colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue'];
    private currentField = {x: -1, y: -1};
    private lastField = {x: 0, y: 0};
    private startField = {x: 0, y: 0};
    private locker = false;
    private noPath = false;

    constructor() {
        this.initBoard();
        this.drawBalls();
    }

    initBoard() {
        for (let x = 0; x < 9; x++) {
            let a = []
            for (let y = 0; y < 9; y++) {
                this.createSquare(x, y);
                a.push(-1)
            }
            this.array.push(a)
        }
    }

    drawBalls() {
        for (let i = 0; i < 25; i++) {
            let colorNum = Math.floor(Math.random() * 5)
            let nextCords = this.findNextCords();

            this.addNewBall(colorNum, nextCords.x, nextCords.y);
            this.array[nextCords.x][nextCords.y] = colorNum;
        }
    }

    onClickBall(x, y) {
        this.clearArray();
        this.stepArr[x][y] = 0;
        this.markField()

        document.getElementById('main').onmousemove = () => {
            if (this.doesFieldChanged()) {
                this.noPath = false;

                let num = this.stepArr[this.currentField.x][this.currentField.y];
                if (num !== -1 && num < 90) {
                    this.clear();
                    this.setFieldRed(this.currentField.x, this.currentField.y)

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
                                            this.setFieldRed(a, b)
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
    }

    markField() {
        let c = 0;
        for (let n = 0; n < 81; n++) {
            for (let a = 0; a < 9; a++) {
                for (let b = 0; b < 9; b++) {
                    if (this.stepArr[a][b] == c) {
                        if (a > 0 && this.stepArr[a - 1][b] == -1) {
                            // document.getElementById((a - 1) + 'x' + b).innerText = (c + 1).toString();
                            this.stepArr[a - 1][b] = c + 1;
                        }

                        if (b > 0 && this.stepArr[a][b - 1] == -1) {
                            // document.getElementById((a + 'x' + (b - 1))).innerText = (c + 1).toString();
                            this.stepArr[a][b - 1] = c + 1;
                        }

                        if (a < 8 && this.stepArr[a + 1][b] == -1) {
                            // document.getElementById((a + 1) + 'x' + b).innerText = (c + 1).toString();
                            this.stepArr[a + 1][b] = c + 1;
                        }

                        if (b < 8 && this.stepArr[a][b + 1] == -1) {
                            // document.getElementById(a + 'x' + (b + 1)).innerText = (c + 1).toString();
                            this.stepArr[a][b + 1] = c + 1;

                        }
                    }
                }
            }
            c = c + 1
        }
    }

    clearArray() {
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

    clear() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                document.getElementById(x + 'x' + y).style.backgroundColor = 'white'
            }
        }
    }

    setFieldRed(x, y) {
        document.getElementById(x + 'x' + y).style.backgroundColor = 'red'
    }

    doesFieldChanged() {
        return this.currentField.x !== this.lastField.x || this.currentField.y !== this.lastField.y
    }

    addNewBall(colorNum, x, y) {
        let ball = document.createElement('div')
        ball.className = 'ball'
        ball.style.backgroundColor = this.colors[colorNum]

        ball.onclick = () => {
            if (!this.locker) {
                this.startField = {x: x, y: y}
                this.onClickBall(x, y);
                this.locker = true;
            }
        }
        document.getElementById(x + 'x' + y).innerHTML = ''
        document.getElementById(x + 'x' + y).append(ball)
    }

    createSquare(x, y) {
        let square = document.createElement('div')
        square.id = x + 'x' + y
        square.className = 'square'
        square.style.left = (y * 52) + 'px'
        square.style.top = (x * 52) + 'px'
        square.onmouseover = () => {
            this.currentField = {x: x, y: y}
        }

        square.onclick = () => {
            if (!this.noPath) {
                if (this.locker && this.array[x][y] == -1) {
                    this.array[x][y] = this.array[this.startField.x][this.startField.y]
                    this.array[this.startField.x][this.startField.y] = -1;
                    document.getElementById(this.startField.x + 'x' + this.startField.y).innerHTML = ''
                    this.addNewBall(this.array[x][y], x, y)
                    document.getElementById('main').onmousemove = undefined;
                    this.clear();
                    this.lastField = {x: 0, y: 0}
                    this.locker = false;
                }
            }
        }
        document.getElementById('main').append(square)
    }

    findNextCords() {
        let x = 0;
        let y = 0;
        while (true) {
            x = Math.floor(Math.random() * 8)
            y = Math.floor(Math.random() * 8)

            if (this.array[x][y] == -1)
                break;
        }
        return {x: x, y: y}
    }
}

new Game()
