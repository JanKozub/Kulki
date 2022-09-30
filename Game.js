var Game = /** @class */ (function () {
    function Game() {
        this.array = [];
        this.colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue'];
        this.initBoard();
        this.drawBalls();
    }
    Game.prototype.initBoard = function () {
        for (var x = 0; x < 9; x++) {
            var a = [];
            for (var y = 0; y < 9; y++) {
                var square = document.createElement('div');
                square.id = x + 'x' + y;
                square.className = 'square';
                square.style.left = (y * 50) + 'px';
                square.style.top = (x * 50) + 'px';
                document.getElementById('main').append(square);
                a.push(-1);
            }
            this.array.push(a);
        }
    };
    Game.prototype.drawBalls = function () {
        var _this = this;
        var _loop_1 = function (i) {
            var colorNum = Math.floor(Math.random() * 5);
            var ball = document.createElement('div');
            ball.className = 'ball';
            ball.style.backgroundColor = this_1.colors[colorNum];
            var x = Math.floor(Math.random() * 8);
            var y = Math.floor(Math.random() * 8);
            ball.onclick = function () { return _this.onClickBall(x, y); };
            document.getElementById(x + 'x' + y).append(ball);
            this_1.array[x][y] = colorNum;
        };
        var this_1 = this;
        for (var i = 0; i < 3; i++) {
            _loop_1(i);
        }
    };
    Game.prototype.onClickBall = function (x, y) {
        this.markField(x, y, 0, 'UP');
        this.markField(x, y, 0, 'DOWN');
        console.log(x, y);
    };
    Game.prototype.markField = function (x, y, num, dir) {
        num = num + 1;
        var x2 = dir === 'UP' ? x - 1 : x + 1;
        if (x > 0 && x < 8 && this.array[x2][y] === -1) {
            this.array[x2][y] = num;
            document.getElementById(x2 + 'x' + y).innerText = num;
            if (x > 1 && x < 7) {
                this.markField(x2, y, num, dir);
            }
        }
        if (y > 0 && this.array[x][y - 1] === -1) {
            this.array[x][y - 1] = num;
            document.getElementById(x + 'x' + (y - 1)).innerText = num;
            if (y > 1) {
                this.markField(x, y - 1, num, dir);
            }
        }
        if (y < 9 && this.array[x][y + 1] === -1) {
            this.array[x][y + 1] = num;
            document.getElementById(x + 'x' + (y + 1)).innerText = num;
            if (y < 9) {
                this.markField(x, y + 1, num, dir);
            }
        }
        return null;
    };
    return Game;
}());
new Game();
