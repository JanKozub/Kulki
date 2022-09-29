var Game = /** @class */ (function () {
    function Game() {
        this.array = [];
        for (var x = 0; x < 9; x++) {
            var a = [];
            for (var y = 0; y < 9; y++) {
                var square = document.createElement('div');
                square.className = 'square';
                document.getElementById('main').append(square);
                a.push(-1);
            }
            this.array.push(a);
        }
        console.log(this.array);
    }
    return Game;
}());
new Game();
