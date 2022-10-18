class Game {
    array = [];
    stepArr = []
    colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue']
    currentField = {x: -1, y: -1}
    lastField = {x: 0, y: 0}

    constructor() {
        this.initBoard();
        this.drawBalls();
    }

    initBoard() {
        for (let x = 0; x < 9; x++) {
            let a = []
            for (let y = 0; y < 9; y++) {
                let square = document.createElement('div')
                square.id = x + 'x' + y
                square.className = 'square'
                square.style.left = (y * 52) + 'px'
                square.style.top = (x * 52) + 'px'
                square.onmouseover = () => {
                    this.currentField = {x: x, y: y}
                }
                document.getElementById('main').append(square)
                a.push(-1)
            }
            this.array.push(a)
        }
    }

    drawBalls() {
        for (let i = 0; i < 25; i++) {
            let colorNum = Math.floor(Math.random() * 5)
            let ball = document.createElement('div')
            ball.className = 'ball'
            ball.style.backgroundColor = this.colors[colorNum]

            let swt = true;
            let x = 0;
            let y = 0;
            while(swt) {
                x = Math.floor(Math.random() * 8)
                y = Math.floor(Math.random() * 8)

                if (this.array[x][y] == -1) {
                    swt = false;
                }
            }

            ball.onclick = () => this.onClickBall(x, y);
            document.getElementById(x + 'x' + y).append(ball)
            this.array[x][y] = colorNum;
        }
    }

    onClickBall(x, y) {
        this.clearArray();
        this.stepArr[x][y] = 0;
        this.markField()

        document.getElementById('main').onmousemove = () => {
            if (this.currentField.x !== this.lastField.x || this.currentField.y !== this.lastField.y) {
                this.clear();

                let num = this.stepArr[this.currentField.x][this.currentField.y];

                if (this.array[this.currentField.x][this.currentField.y] === -1) {
                    document.getElementById(this.currentField.x + 'x' + this.currentField.y)
                        .style.backgroundColor = 'red'
                }

                let counter = 0;
                while (num > 0) {
                    for (let i = -1; i <= 1; i++) {
                        for (let k = -1; k <= 1; k++) {
                            let a = this.currentField.x - i;
                            let b = this.currentField.y - k;

                            if (a >= 0 && b >= 0 && a <= 8 && b <= 8) {
                                if ((i == -1 && k == 0) || (i == 1 && k == 0) || (i == 0)) {
                                    if (this.stepArr[a][b] <= num) {
                                        num = this.stepArr[a][b];
                                        this.currentField = {x: a, y: b}
                                        document.getElementById(a + 'x' + b).style.backgroundColor = 'red'
                                        counter = 0;
                                    }
                                }
                            }
                        }
                    }
                    counter++

                    if (counter > 200) {
                        break;
                    }
                }

                this.lastField = this.currentField;
            }
        }
    }

    markField() {
        let c = 0;
        for (let n = 0; n < 16; n++) {
            for (let a = 0; a < 9; a++) {
                for (let b = 0; b < 9; b++) {
                    if (this.stepArr[a][b] == c) {
                        if (a > 0 && this.stepArr[a - 1][b] == -1) {
                            document.getElementById((a - 1) + 'x' + b).innerText = (c + 1).toString();
                            this.stepArr[a - 1][b] = c + 1;
                        }

                        if (b > 0 && this.stepArr[a][b - 1] == -1) {
                            document.getElementById((a + 'x' + (b - 1))).innerText = (c + 1).toString();
                            this.stepArr[a][b - 1] = c + 1;
                        }

                        if (a < 8 && this.stepArr[a + 1][b] == -1) {
                            document.getElementById((a + 1) + 'x' + b).innerText = (c + 1).toString();
                            this.stepArr[a + 1][b] = c + 1;
                        }

                        if (b < 8 && this.stepArr[a][b + 1] == -1) {
                            document.getElementById(a + 'x' + (b + 1)).innerText = (c + 1).toString();
                            this.stepArr[a][b + 1] = c + 1;

                        }
                    }
                }
            }
            c = c + 1
        }
    }

    clearArray() {
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
}

new Game()
