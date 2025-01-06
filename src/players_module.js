const {board} = require('./main')

let players = []

class Player{
    constructor(type, id) {
        this.type = type;
        this.id = id;
        this.board = board.getBoard(this.id);
    }

    getBoard() {
        return this.board;
    }
}

module.exports =  {Player};
