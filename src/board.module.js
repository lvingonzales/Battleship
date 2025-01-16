import gameController from "./game_controller.module";

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

  getCells() {
    let cells = [];
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board.length; y++) {
        cells.push(this.board[x][y]);
      }
    }

    return cells;
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
      throw new Error("Invalid Placement");
    }
    if (cell.x >= 0 && cell.x <= 9 && cell.y >= 0 && cell.y <= 9) {
      if (cell.ship !== null) {
        throw new Error("Cells Occupied");
      }
      if (cell.value <= 1) {
        return true;
      }
    }
    return false;
  }

  receiveAttack(player, cell) {
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

  addShip(start, direction, length) {
    // if (row_col > 1 || row_col < 0 || up_down > 1 || up_down < 0) {
    //   throw new Error(`Invalid Direction`);
    // }
    let ship = gameController
      .getActivePlayer()
      .ships.find((element) => element.length === Number(length));
      let validCells = null;

      try {
        validCells = this.checkValidCells(start, direction, length);
      } catch (error) {
        throw error;
      }
    
      validCells.forEach((cell) => {
        this.getCell(cell.x, cell.y).value = 1;
        this.getCell(cell.x, cell.y).ship = ship;
      });
    // 50/50 chance to determine the direction boats are placed in,
    // let row_colChoice = (Math.random() >= 0.5)? 1 : 0; // 0: row, 1 col
    // let directionChoice = (Math.random() >= 0.5)? 1 : 0; // 0: up/right, 1: down/left
  }

  checkValidCells(start, direction, length) {
    let currentCell = this.getCell(start.x, start.y);
    let validCells = [];

    try {
      for (let i = 0; i < length; i++) {
        this.checkCell(currentCell);
        validCells.push(currentCell);
        if (direction === 0) {
          if (i !== length-1) {
            currentCell = this.getCell(currentCell.x + 1, currentCell.y);
          }
        } else {
          if (i !== length-1) {
            currentCell = this.getCell(currentCell.x, currentCell.y + 1);
          }
        }
      }
    } catch (error) {
      throw error;
    }
    return validCells;
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

// module.exports = gameBoard;

export { gameBoard, Ship };
