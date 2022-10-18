var Game = /** @class */ (function () {
    function Game() {
        this.array = [];
        this.stepArr = [];
        this.colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue'];
        this.currentField = { x: -1, y: -1 };
        this.lastField = { x: 0, y: 0 };
        this.initBoard();
        this.drawBalls();
    }
    Game.prototype.initBoard = function () {
        var _this = this;
        var _loop_1 = function (x) {
            var a = [];
            var _loop_2 = function (y) {
                var square = document.createElement('div');
                square.id = x + 'x' + y;
                square.className = 'square';
                square.style.left = (y * 52) + 'px';
                square.style.top = (x * 52) + 'px';
                square.onmouseover = function () {
                    _this.currentField = { x: x, y: y };
                };
                document.getElementById('main').append(square);
                a.push(-1);
            };
            for (var y = 0; y < 9; y++) {
                _loop_2(y);
            }
            this_1.array.push(a);
        };
        var this_1 = this;
        for (var x = 0; x < 9; x++) {
            _loop_1(x);
        }
    };
    Game.prototype.drawBalls = function () {
        var _this = this;
        var _loop_3 = function (i) {
            var colorNum = Math.floor(Math.random() * 5);
            var ball = document.createElement('div');
            ball.className = 'ball';
            ball.style.backgroundColor = this_2.colors[colorNum];
            var swt = true;
            var x = 0;
            var y = 0;
            while (swt) {
                x = Math.floor(Math.random() * 8);
                y = Math.floor(Math.random() * 8);
                if (this_2.array[x][y] == -1) {
                    swt = false;
                }
            }
            ball.onclick = function () { return _this.onClickBall(x, y); };
            document.getElementById(x + 'x' + y).append(ball);
            this_2.array[x][y] = colorNum;
        };
        var this_2 = this;
        for (var i = 0; i < 25; i++) {
            _loop_3(i);
        }
    };
    Game.prototype.onClickBall = function (x, y) {
        var _this = this;
        this.clearArray();
        this.stepArr[x][y] = 0;
        this.markField();
        document.getElementById('main').onmousemove = function () {
            if (_this.currentField.x !== _this.lastField.x || _this.currentField.y !== _this.lastField.y) {
                _this.clear();
                var num = _this.stepArr[_this.currentField.x][_this.currentField.y];
                if (_this.array[_this.currentField.x][_this.currentField.y] === -1) {
                    document.getElementById(_this.currentField.x + 'x' + _this.currentField.y)
                        .style.backgroundColor = 'red';
                }
                var counter = 0;
                while (num > 0) {
                    for (var i = -1; i <= 1; i++) {
                        for (var k = -1; k <= 1; k++) {
                            var a = _this.currentField.x - i;
                            var b = _this.currentField.y - k;
                            if (a >= 0 && b >= 0 && a <= 8 && b <= 8) {
                                if ((i == -1 && k == 0) || (i == 1 && k == 0) || (i == 0)) {
                                    if (_this.stepArr[a][b] <= num) {
                                        num = _this.stepArr[a][b];
                                        _this.currentField = { x: a, y: b };
                                        document.getElementById(a + 'x' + b).style.backgroundColor = 'red';
                                        counter = 0;
                                    }
                                }
                            }
                        }
                    }
                    counter++;
                    if (counter > 200) {
                        break;
                    }
                }
                _this.lastField = _this.currentField;
            }
        };
    };
    Game.prototype.markField = function () {
        var c = 0;
        for (var n = 0; n < 16; n++) {
            for (var a = 0; a < 9; a++) {
                for (var b = 0; b < 9; b++) {
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
            c = c + 1;
        }
    };
    Game.prototype.clearArray = function () {
        for (var x = 0; x < 9; x++) {
            var a = [];
            for (var y = 0; y < 9; y++) {
                if (this.array[x][y] > -1) {
                    a.push(100);
                }
                else {
                    a.push(-1);
                }
            }
            this.stepArr.push(a);
        }
    };
    Game.prototype.clear = function () {
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                document.getElementById(x + 'x' + y).style.backgroundColor = 'white';
            }
        }
    };
    return Game;
}());
new Game();
