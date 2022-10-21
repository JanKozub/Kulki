var Game = /** @class */ (function () {
    function Game() {
        this.array = [];
        this.stepArr = [];
        this.colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue'];
        this.currentField = { x: -1, y: -1 };
        this.lastField = { x: 0, y: 0 };
        this.startField = { x: 0, y: 0 };
        this.locker = false;
        this.noPath = false;
        this.initBoard();
        this.drawBalls();
    }
    Game.prototype.initBoard = function () {
        for (var x = 0; x < 9; x++) {
            var a = [];
            for (var y = 0; y < 9; y++) {
                this.createSquare(x, y);
                a.push(-1);
            }
            this.array.push(a);
        }
    };
    Game.prototype.drawBalls = function () {
        for (var i = 0; i < 25; i++) {
            var colorNum = Math.floor(Math.random() * 5);
            var nextCords = this.findNextCords();
            this.addNewBall(colorNum, nextCords.x, nextCords.y);
            this.array[nextCords.x][nextCords.y] = colorNum;
        }
    };
    Game.prototype.onClickBall = function (x, y) {
        var _this = this;
        this.clearArray();
        this.stepArr[x][y] = 0;
        this.markField();
        document.getElementById('main').onmousemove = function () {
            if (_this.doesFieldChanged()) {
                _this.noPath = false;
                var num = _this.stepArr[_this.currentField.x][_this.currentField.y];
                if (num !== -1 && num < 90) {
                    _this.clear();
                    _this.setFieldRed(_this.currentField.x, _this.currentField.y);
                    var fields = _this.currentField;
                    while (num > 0) {
                        for (var i = -1; i <= 1; i++) {
                            for (var k = -1; k <= 1; k++) {
                                var a = fields.x - i;
                                var b = fields.y - k;
                                if (a >= 0 && b >= 0 && a <= 8 && b <= 8) {
                                    if ((i == -1 && k == 0) || (i == 1 && k == 0) || (i == 0)) {
                                        if (_this.stepArr[a][b] <= num) {
                                            num = _this.stepArr[a][b];
                                            fields = { x: a, y: b };
                                            _this.setFieldRed(a, b);
                                            _this.noPath = false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    _this.lastField = _this.currentField;
                }
                else {
                    _this.noPath = true;
                }
            }
        };
    };
    Game.prototype.markField = function () {
        var c = 0;
        for (var n = 0; n < 81; n++) {
            for (var a = 0; a < 9; a++) {
                for (var b = 0; b < 9; b++) {
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
            c = c + 1;
        }
    };
    Game.prototype.clearArray = function () {
        this.stepArr = [];
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
    Game.prototype.setFieldRed = function (x, y) {
        document.getElementById(x + 'x' + y).style.backgroundColor = 'red';
    };
    Game.prototype.doesFieldChanged = function () {
        return this.currentField.x !== this.lastField.x || this.currentField.y !== this.lastField.y;
    };
    Game.prototype.addNewBall = function (colorNum, x, y) {
        var _this = this;
        var ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.backgroundColor = this.colors[colorNum];
        ball.onclick = function () {
            if (!_this.locker) {
                _this.startField = { x: x, y: y };
                _this.onClickBall(x, y);
                _this.locker = true;
            }
        };
        document.getElementById(x + 'x' + y).innerHTML = '';
        document.getElementById(x + 'x' + y).append(ball);
    };
    Game.prototype.createSquare = function (x, y) {
        var _this = this;
        var square = document.createElement('div');
        square.id = x + 'x' + y;
        square.className = 'square';
        square.style.left = (y * 52) + 'px';
        square.style.top = (x * 52) + 'px';
        square.onmouseover = function () {
            _this.currentField = { x: x, y: y };
        };
        square.onclick = function () {
            if (!_this.noPath) {
                if (_this.locker && _this.array[x][y] == -1) {
                    _this.array[x][y] = _this.array[_this.startField.x][_this.startField.y];
                    _this.array[_this.startField.x][_this.startField.y] = -1;
                    document.getElementById(_this.startField.x + 'x' + _this.startField.y).innerHTML = '';
                    _this.addNewBall(_this.array[x][y], x, y);
                    document.getElementById('main').onmousemove = undefined;
                    _this.clear();
                    _this.lastField = { x: 0, y: 0 };
                    _this.locker = false;
                }
            }
        };
        document.getElementById('main').append(square);
    };
    Game.prototype.findNextCords = function () {
        var x = 0;
        var y = 0;
        while (true) {
            x = Math.floor(Math.random() * 8);
            y = Math.floor(Math.random() * 8);
            if (this.array[x][y] == -1)
                break;
        }
        return { x: x, y: y };
    };
    return Game;
}());
new Game();
