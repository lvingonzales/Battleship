import {gameBoard, Ship} from "./board.module";
class Player {
  constructor(type, id, name) {
    this.type = type;
    this.id = id;
    this.name = name;
    this.board = new gameBoard();
    this.board.fillBoard();
    this.ships = [];
  }

  getBoard() {
    return this.board.board;
  }
}

const gameController = {
  players: [],
  phase: "setup",

  initializeGame(gameType) {
    console.log(`initializing game with game type ${gameType}`);
    switch (gameType) {
      case "pvp":
        this.players.push(new Player("hum", 0, "John Doe"));
        this.players.push(new Player("hum", 1, "Jane Doe"));
        break;
      case "pve":
        this.players.push(new Player("hum", 0, "John Doe"));
        this.players.push(new Player("com", 1, "Jane Doe"));
        break;
      case "cvc":
        this.players.push(new Player("com", 0, "John Doe"));
        this.players.push(new Player("com", 1, "Jane Doe"));
        break;
      default:
        this.players.push(new Player("hum", 0, "John Doe"));
        this.players.push(new Player("com", 1, "Jane Doe"));
        break;
    }

    this.players.forEach((player) => {
      player.ships = addShipSet();
    });
    this.activePlayer = this.players[0];
    this.phase = "setup";
    // this.boardTest();
  },

  getActivePlayer() {
    return this.activePlayer;
  },

  getOpposingBoard() {
    let board =
      this.getActivePlayer() === this.players[0]
        ? this.players[1].board
        : this.players[0].board;
    return board;
  },

  changeTurns() {
    this.activePlayer =
      this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
  },
};

function addShipSet() {
  let carrier = new Ship(5);
  let battleship = new Ship(4);
  let submarine = new Ship(3);
  let destroyer = new Ship(3);
  let patrolBoat = new Ship(2);

  return [carrier, battleship, submarine, destroyer, patrolBoat];
}

export default gameController;
