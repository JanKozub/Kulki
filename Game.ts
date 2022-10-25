class Game {
    private array = [];
    private stepArr = [];
    private colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue', 'pink'];
    private currentField = {x: -1, y: -1};
    private lastField = {x: 0, y: 0};
    private startField = {x: 0, y: 0};
    private nextBalls = [];
    private locker = false;
    private noPath = false;
    private coolDown = false;
    private mainEl = undefined;
    private minStrikeSize = 5

    constructor() {
        this.mainEl = document.getElementById('main');
        this.initBoard();
        this.drawNextBalls();
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

    drawNextBalls() {
        if (this.nextBalls.length == 0) {
            for (let i = 0; i < 3; i++) {
                this.nextBalls.push(this.getRandomColorNum())
            }
        }

        for (let i = 0; i < 3; i++) {
            let nextCords = this.findNextCords();

            this.addNewBall(this.nextBalls[i], nextCords.x, nextCords.y);
            this.array[nextCords.x][nextCords.y] = this.nextBalls[i];
        }

        this.nextBalls = []
        let nextBalls = document.getElementById('next-balls');
        nextBalls.innerHTML = ''
        for (let i = 0; i < 3; i++) {
            let colorNum = this.getRandomColorNum()
            this.nextBalls.push(colorNum)
            let ball = document.createElement('div')
            ball.className = 'ball'
            ball.style.marginLeft = '5px'
            ball.style.marginRight = '5px'
            ball.style.backgroundColor = this.colors[colorNum]
            nextBalls.append(ball)
        }
    }

    makeRedPath() {
        if (this.doesFieldChanged()) {
            this.noPath = false;

            let num = this.stepArr[this.currentField.x][this.currentField.y];
            if (num !== -1 && num < 90) {
                this.clearRedPath();
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

    markField(x, y) {
        this.stepArr[x][y] = 0;
        let c = 0;
        for (let n = 0; n < 81; n++) {
            for (let a = 0; a < 9; a++) {
                for (let b = 0; b < 9; b++) {
                    if (this.stepArr[a][b] == c) {
                        if (a > 0 && this.stepArr[a - 1][b] == -1) {
                            // this.getSquareWithCords(a - 1, b).innerText = (c + 1).toString();
                            this.stepArr[a - 1][b] = c + 1;
                        }

                        if (b > 0 && this.stepArr[a][b - 1] == -1) {
                            // this.getSquareWithCords(a, b - 1).innerText = (c + 1).toString();
                            this.stepArr[a][b - 1] = c + 1;
                        }

                        if (a < 8 && this.stepArr[a + 1][b] == -1) {
                            // this.getSquareWithCords(a + 1, b).innerText = (c + 1).toString();
                            this.stepArr[a + 1][b] = c + 1;
                        }

                        if (b < 8 && this.stepArr[a][b + 1] == -1) {
                            // this.getSquareWithCords(a, b + 1).innerText = (c + 1).toString();
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

    clearRedPath() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.getSquareWithCords(x, y).style.backgroundColor = 'white'
            }
        }
    }

    setPathGray() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                let square = this.getSquareWithCords(x, y);
                if (square.style.backgroundColor == 'red') {
                    square.style.backgroundColor = 'gray'
                }
            }
        }
    }

    setFieldRed(x, y) {
        this.getSquareWithCords(x, y).style.backgroundColor = 'red'
    }

    doesFieldChanged() {
        return (this.currentField.x != this.lastField.x || this.currentField.y != this.lastField.y)
    }

    addNewBall(colorNum, x, y) {
        let ball = document.createElement('div')
        ball.className = 'ball'
        ball.style.backgroundColor = this.colors[colorNum]

        ball.onclick = () => {
            if (!this.locker) {
                this.startField = {x: x, y: y}
                this.setBallSize(ball, 'big')
                this.clearArray();
                this.markField(x, y);
                this.mainEl.onmousemove = () => this.makeRedPath()
                this.locker = true;
            } else {
                if (this.startField.x == x && this.startField.y == y) {
                    this.setBallSize(ball, 'small')
                    this.mainEl.onmousemove = undefined;
                    this.clearRedPath();
                    this.lastField = {x: 0, y: 0}
                    this.locker = false;
                }
            }
        }
        let square = this.getSquareWithCords(x, y)
        square.innerHTML = ''
        square.append(ball)
    }

    createSquare(x, y) {
        let square = document.createElement('div')
        square.id = x + 'x' + y
        square.className = 'square'
        square.style.left = (y * 52) + 'px'
        square.style.top = (x * 52) + 'px'
        square.onmouseover = () => this.currentField = {x: x, y: y}

        square.onclick = () => {
            if (!this.noPath) {
                console.log('chuj2')
                if (this.locker && this.array[x][y] == -1 && !this.coolDown) {
                    console.log('chuj69')
                    this.array[x][y] = this.array[this.startField.x][this.startField.y]
                    this.removeBallAtCords(this.startField.x, this.startField.y);
                    this.addNewBall(this.array[x][y], x, y);
                    this.mainEl.onmousemove = undefined;
                    this.lastField = {x: 0, y: 0}

                    this.coolDown = true;
                    this.setPathGray();
                    setTimeout(() => {
                        this.strikeBalls(x, y)
                        this.clearRedPath()
                        this.drawNextBalls();
                        this.locker = false;
                        this.coolDown = false;
                    }, 1000)
                }
            } else {
                let targetBall = this.getBallAtCords(x, y);
                if (targetBall !== undefined) {
                    this.clearRedPath();
                    this.setBallSize(this.getBallAtCords(this.startField.x, this.startField.y), 'small')
                    this.setBallSize(targetBall, 'big')
                    this.lastField = {x: 0, y: 0}
                    this.startField = {x: x, y: y}
                    this.clearArray();
                    this.markField(x, y);
                }
            }
        }
        this.mainEl.append(square)
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

    getSquareWithCords(x, y) {
        return document.getElementById(x + 'x' + y)
    }

    getBallAtCords(x, y) {
        return this.getSquareWithCords(x, y)
            .getElementsByClassName('ball')[0]
    }

    removeBallAtCords(x, y) {
        this.array[x][y] = -1;
        this.getSquareWithCords(x, y).innerHTML = ''
    }

    setBallSize(ball, size) {
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

    getRandomColorNum() {
        return Math.floor(Math.random() * this.colors.length)
    }

    addPoints(points) {
        let pointsEl = document.getElementById('points');
        pointsEl.innerText = parseInt(pointsEl.innerText) + points
    }

    strikeBalls(x, y) {
        let color = this.array[x][y]
        let result = []
        result = result.concat(this.checkVertical(x, y, color));
        result = result.concat(this.checkHorizontal(x, y, color));
        result = result.concat(this.checkDiagonal1(x, y, color));
        result = result.concat(this.checkDiagonal2(x, y, color));

        if (result.length > 0) {
            result.push({x: x, y: y})
        }

        this.addPoints(result.length)
        result.forEach((e) => {
            this.removeBallAtCords(e.x, e.y)
        })
    }

    checkVertical(x, y, color) {
        let result = [];
        let x2 = x - 1;
        while (x2 >= 0) {
            if (this.array[x2][y] == color) {
                result.push({x: x2, y: y});
            } else {
                break;
            }
            x2--;
        }
        x2 = x + 1;
        while (x2 < 9) {
            if (this.array[x2][y] == color) {
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

    checkHorizontal(x, y, color) {
        let result = [];
        let y2 = y - 1;
        while (y2 >= 0) {
            if (this.array[x][y2] == color) {
                result.push({x: x, y: y2});
            } else {
                break;
            }
            y2--;
        }
        y2 = y + 1;
        while (y2 < 9) {
            if (this.array[x][y2] == color) {
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

    checkDiagonal1(x, y, color) {
        let result = [];
        let x2 = x - 1;
        let y2 = y - 1;
        while (x2 >= 0 && y2 >= 0) {
            if (this.array[x2][y2] == color) {
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
            if (this.array[x2][y2] == color) {
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

    checkDiagonal2(x, y, color) {
        let result = [];
        let x2 = x - 1;
        let y2 = y + 1;
        while (x2 >= 0 && y2 < 9) {
            if (this.array[x2][y2] == color) {
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
            if (this.array[x2][y2] == color) {
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

new Game()
