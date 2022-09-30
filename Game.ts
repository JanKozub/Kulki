class Game {
    array = [];
    colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue']

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
                square.style.left = (y * 50) + 'px'
                square.style.top = (x * 50) + 'px'
                document.getElementById('main').append(square)
                a.push(-1)
            }
            this.array.push(a)
        }
    }

    drawBalls() {
        for (let i = 0; i < 3; i++) {
            let colorNum = Math.floor(Math.random() * 5)
            let ball = document.createElement('div')
            ball.className = 'ball'
            ball.style.backgroundColor = this.colors[colorNum]

            let x = Math.floor(Math.random() * 8)
            let y = Math.floor(Math.random() * 8)
            ball.onclick = () => this.onClickBall(x, y);
            document.getElementById(x + 'x' + y).append(ball)
            this.array[x][y] = colorNum;
        }
    }

    onClickBall(x, y) {
        this.markField(x, y, 0, 'UP')
        this.markField(x, y, 0, 'DOWN')
        console.log(x, y)
    }

    markField(x, y, num, dir) {
        num = num + 1;

        let x2 = dir === 'UP' ? x - 1 : x + 1;
        if (x > 0 && x < 8 && this.array[x2][y] === -1) {
            this.array[x2][y] = num;
            document.getElementById(x2 + 'x' + y).innerText = num;
            if (x > 1 && x < 7) {
                this.markField(x2, y, num, dir)
            }
        }

        if (y > 0 && this.array[x][y - 1] === -1) {
            this.array[x][y - 1] = num;
            document.getElementById(x + 'x' + (y - 1)).innerText = num;
            if (y > 1) {
                this.markField(x, y - 1, num, dir)
            }
        }

        if (y < 9 && this.array[x][y + 1] === -1) {
            this.array[x][y + 1] = num;
            document.getElementById(x + 'x' + (y + 1)).innerText = num;
            if (y < 9) {
                this.markField(x, y + 1, num, dir)
            }
        }
        return null
    }
}

new Game()
