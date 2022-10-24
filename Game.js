var Game = /** @class */ (function () {
    function Game() {
        this.array = [];
        this.stepArr = [];
        this.colors = ['white', 'black', 'red', 'yellow', 'orange', 'blue', 'pink'];
        this.currentField = { x: -1, y: -1 };
        this.lastField = { x: 0, y: 0 };
        this.startField = { x: 0, y: 0 };
        this.locker = false;
        this.noPath = false;
        this.mainEl = undefined;
        this.mainEl = document.getElementById('main');
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
    Game.prototype.makeRedPath = function () {
        if (this.doesFieldChanged()) {
            this.noPath = false;
            var num = this.stepArr[this.currentField.x][this.currentField.y];
            if (num !== -1 && num < 90) {
                this.clearRedPath();
                this.setFieldRed(this.currentField.x, this.currentField.y);
                var fields = this.currentField;
                while (num > 0) {
                    for (var i = -1; i <= 1; i++) {
                        for (var k = -1; k <= 1; k++) {
                            var a = fields.x - i;
                            var b = fields.y - k;
                            if (a >= 0 && b >= 0 && a <= 8 && b <= 8) {
                                if ((i == -1 && k == 0) || (i == 1 && k == 0) || (i == 0)) {
                                    if (this.stepArr[a][b] <= num) {
                                        num = this.stepArr[a][b];
                                        fields = { x: a, y: b };
                                        this.setFieldRed(a, b);
                                        this.noPath = false;
                                    }
                                }
                            }
                        }
                    }
                }
                this.lastField = this.currentField;
            }
            else {
                this.noPath = true;
            }
        }
    };
    Game.prototype.markField = function (x, y) {
        this.stepArr[x][y] = 0;
        var c = 0;
        for (var n = 0; n < 81; n++) {
            for (var a = 0; a < 9; a++) {
                for (var b = 0; b < 9; b++) {
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
    Game.prototype.clearRedPath = function () {
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                this.getSquareWithCords(x, y).style.backgroundColor = 'white';
            }
        }
    };
    Game.prototype.setPathGray = function () {
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                var square = this.getSquareWithCords(x, y);
                if (square.style.backgroundColor == 'red') {
                    square.style.backgroundColor = 'gray';
                }
            }
        }
    };
    Game.prototype.setFieldRed = function (x, y) {
        this.getSquareWithCords(x, y).style.backgroundColor = 'red';
    };
    Game.prototype.doesFieldChanged = function () {
        return (this.currentField.x != this.lastField.x || this.currentField.y != this.lastField.y);
    };
    Game.prototype.addNewBall = function (colorNum, x, y) {
        var _this = this;
        var ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.backgroundColor = this.colors[colorNum];
        ball.onclick = function () {
            if (!_this.locker) {
                _this.startField = { x: x, y: y };
                _this.setBallSize(ball, 'big');
                _this.clearArray();
                _this.markField(x, y);
                _this.mainEl.onmousemove = function () { return _this.makeRedPath(); };
                _this.locker = true;
            }
            else {
                if (_this.startField.x == x && _this.startField.y == y) {
                    _this.setBallSize(ball, 'small');
                    _this.mainEl.onmousemove = undefined;
                    _this.clearRedPath();
                    _this.lastField = { x: 0, y: 0 };
                    _this.locker = false;
                }
            }
        };
        var square = this.getSquareWithCords(x, y);
        square.innerHTML = '';
        square.append(ball);
    };
    Game.prototype.createSquare = function (x, y) {
        var _this = this;
        var square = document.createElement('div');
        square.id = x + 'x' + y;
        square.className = 'square';
        square.style.left = (y * 52) + 'px';
        square.style.top = (x * 52) + 'px';
        square.onmouseover = function () { return _this.currentField = { x: x, y: y }; };
        square.onclick = function () {
            if (!_this.noPath) {
                if (_this.locker && _this.array[x][y] == -1) {
                    _this.array[x][y] = _this.array[_this.startField.x][_this.startField.y];
                    _this.array[_this.startField.x][_this.startField.y] = -1;
                    _this.getSquareWithCords(_this.startField.x, _this.startField.y).innerHTML = '';
                    _this.addNewBall(_this.array[x][y], x, y);
                    _this.mainEl.onmousemove = undefined;
                    _this.setPathGray();
                    setTimeout(function () { return _this.clearRedPath(); }, 1000);
                    _this.lastField = { x: 0, y: 0 };
                    _this.locker = false;
                }
            }
            else {
                var targetBall = _this.getBallAtCords(x, y);
                if (targetBall !== undefined) {
                    _this.clearRedPath();
                    _this.setBallSize(_this.getBallAtCords(_this.startField.x, _this.startField.y), 'small');
                    _this.setBallSize(targetBall, 'big');
                    _this.lastField = { x: 0, y: 0 };
                    _this.startField = { x: x, y: y };
                    _this.clearArray();
                    _this.markField(x, y);
                }
            }
        };
        this.mainEl.append(square);
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
    Game.prototype.getSquareWithCords = function (x, y) {
        return document.getElementById(x + 'x' + y);
    };
    Game.prototype.getBallAtCords = function (x, y) {
        return this.getSquareWithCords(x, y)
            .getElementsByClassName('ball')[0];
    };
    Game.prototype.setBallSize = function (ball, size) {
        if (size == 'big') {
            ball.style.width = '46px';
            ball.style.height = '46px';
            ball.style.top = '1px';
            ball.style.left = '1px';
        }
        else if (size == 'small') {
            ball.style.width = '36px';
            ball.style.height = '36px';
            ball.style.top = '6px';
            ball.style.left = '6px';
        }
    };
    return Game;
}());
new Game();
