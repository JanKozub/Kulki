class Game {
    array = [];
    constructor() {
        for (let x = 0; x < 9; x++) {
            let a = []
            for (let y = 0; y < 9; y++) {
                let square = document.createElement('div')
                square.className = 'square'
                document.getElementById('main').append(square)
                a.push(-1)
            }
            this.array.push(a)
        }
        console.log(this.array)
    }
}

new Game()
