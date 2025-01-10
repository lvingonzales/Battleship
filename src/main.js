import "./style.css";
import { changeScreen, homePage, clearPage } from "./user_interface_module";

class Ship {
  constructor(length) {
    this.length = length;
    this.hp = length;
  }

  hit() {
    this.hp = this.hp - 1;
    return true;
  }

  isSunk() {
    if (this.hp === 0) {
      return true;
    } else {
      return false;
    }
  }
}

class gameBoard {
  constructor() {
    this.board = [...Array(10)].map(() => Array(10).fill(null));
  }

  fillBoard() {
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board.length; y++) {
        this.board[x][y] = new Cell(x, y);
      }
    }
  }

  getCell(x, y, board = this.board) {
    return board[x][y];
  }

  checkCell(cell) {
    if (cell === null || cell === undefined) {
      return false;
    }
    if (cell.x >= 0 && cell.x <= 9 && cell.y >= 0 && cell.y <= 9) {
      if (cell.ship !== null) {
        return false;
      }
      if (cell.value <= 1) {
        return true;
      }
    }
    return false;
  }

  receiveAttack(cell) {
    let player = gameController.getActivePlayer();

    if (cell.ship === null) {
      cell.value = cell.value + 2;
      return `${player.name} shot cell: ${cell.x},${cell.y} ... MISS!`;
    } else {
      cell.value = cell.value + 2;
      cell.ship.hit();
      if (cell.ship.isSunk() === true) {
        return `${player.name} shot cell: ${cell.x},${cell.y} ... SUNK!`;
      }
      return `${player.name} shot cell: ${cell.x},${cell.y} ... HIT!`;
    }
  }

  addShip(x, y, row_col, up_down, length, board = this.board) {
    if (row_col > 1 || row_col < 0 || up_down > 1 || up_down < 0) {
      throw new Error(`Invalid Direction`);
    }
    if (board[x][y].value === 0) {
      let newShip = new Ship(length);

      // 50/50 chance to determine the direction boats are placed in,
      // let row_colChoice = (Math.random() >= 0.5)? 1 : 0; // 0: row, 1 col
      // let directionChoice = (Math.random() >= 0.5)? 1 : 0; // 0: up/right, 1: down/left
      if (!this.checkShipCells(x, y, row_col, up_down, length)) {
        throw new Error(`Invalid Placement`);
      }

      for (let i = 0; i < length; i++) {
        if (row_col === 0) {
          if (up_down === 0) {
            board[x][y].ship = newShip;
            board[x][y].value = 1;
            y = y + 1;
          } else {
            board[x][y].ship = newShip;
            board[x][y].value = 1;
            y = y - 1;
          }
        } else {
          if (up_down === 0) {
            board[x][y].ship = newShip;
            board[x][y].value = 1;
            x = x - 1;
          } else {
            board[x][y].ship = newShip;
            board[x][y].value = 1;
            x = x + 1;
          }
        }
      }
    }

    return board[x][y].ship;
  }

  checkShipCells(x, y, row_col, up_down, length) {
    for (let i = 0; i < length; i++) {
      if (!this.checkCell(this.getCell(x, y))) {
        return false;
      }
      if (row_col === 1) {
        if (up_down === 0) {
          x = x - 1;
        } else {
          x = x + 1;
        }
      } else {
        if (up_down === 0) {
          y = y + 1;
        } else {
          y = y - 1;
        }
      }
    }
    return true;
  }
}



class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.value = 0;
    this.ship = null;
  }
}
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
  phase: 'setup',

  initializeGame(gameType) {
    console.log(`initializing game with game type ${gameType}`);
    switch (gameType) {
      case "pvp":
        this.players.push(new Player("hum", 0, 'John Doe'));
        this.players.push(new Player("hum", 1, 'Jane Doe'));
        break;
      case "pve":
        this.players.push(new Player("hum", 0, 'John Doe'));
        this.players.push(new Player("com", 1, 'Jane Doe'));
        break;
      case "cvc":
        this.players.push(new Player("com", 0, 'John Doe'));
        this.players.push(new Player("com", 1, 'Jane Doe'));
        break;
      default:
        this.players.push(new Player("hum", 0, 'John Doe'));
        this.players.push(new Player("com", 1, 'Jane Doe'));
        break;
    }

    this.players.forEach(player => {
      player.ships = addShipSet();
    })
    this.activePlayer = this.players[0];
    this.phase = 'setup';
  },

  getActivePlayer() {
    return this.activePlayer;
  },

  getOpposingBoard() {
    let board = this.getActivePlayer() === this.players[0] ? this.players[1].board : this.players[0].board; 
    return board;
  },

  changeTurns() {
    this.activePlayer =
      this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
  },

  boardTest() {
    console.log(`setting player ones board`);
    let player = this.getActivePlayer();

    player.board.addShip(3, 3, 0, 0, 4);
    console.log(`finished`);
    console.log('setting player 2s board');
    this.changeTurns();
    player = this.getActivePlayer();

    player.board.addShip(6, 6, 1, 0, 4);
    console.log(`finished`);

    this.changeTurns();
    this.phase = 'play';
  },

  changeScreen(state, gameType) {
    clearPage();
    switch (state) {
      case "start":
        gameController.initializeGame(gameType);
        gameController.boardTest();
        gamePage.loadGamePage();
        gamePage.createBoard();
        gamePage.loadCellData();
        break;
      case "home":
        homePage.loadHomePage();
        break;
    }
  },
};

function addShipSet () {
  let carrier = new Ship(5);
  let battleship = new Ship(4);
  let submarine = new Ship(3);
  let destroyer = new Ship(3);
  let patrolBoat = new Ship(2);

  return [carrier, battleship, submarine, destroyer, patrolBoat];
}

changeScreen('start', 'pvp');
