import "./style.css";

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

const board = {
  p1_board: [...Array(10)].map(() => Array(10).fill(null)),
  p2_board: [...Array(10)].map(() => Array(10).fill(null)),

  getBoard(id){
    return id === 0 ? this.p1_board : this.p2_board;
  },

  fillBoard() {
    for (let x = 0; x < this.p1_board.length; x++) {
      for (let y = 0; y < this.p1_board.length; y++) {
        this.p1_board[x][y] = new Cell(x, y);
      }
    }
  },

  getCell(x, y) {
    return this.p1_board[x][y];
  },

  setCell(x, y, value) {
    cell = this.getCell(x, y);
    cell = cell + value;
    return cell;
  },

  checkCell(x, y) {
    if (x >= 0 && x <= 9 && y >= 0 && y <= 9) {
      let cell = this.getCell(x, y);
      if (cell.ship !== null) {
        return false;
      }
      if (cell.value <= 1) {
        return true;
      }
    }
    return false;
  },

  receiveAttack(x, y) {
    let cell = this.getCell(x, y);

    if (cell.value === 0) {
      cell.value = cell.value + 2;
      return `Shot cell: ${x},${y} ... MISS!`;
    } else if (cell.value === 1) {
      cell.value = cell.value + 2;
      cell.ship.hit();
      if (cell.ship.isSunk() === true) {
        return `Shot cell: ${x},${y} ... SUNK!`;
      }
      return `Shot cell: ${x},${y} ... HIT!`;
    }
  },
};

function addShip(x, y, row_col, up_down, length) {
  if (row_col > 1 || row_col < 0 || up_down > 1 || up_down < 0) {
    throw new Error(`Invalid Direction`);
  }
  if (board.p1_board[x][y].value === 0) {
    let newShip = new Ship(length);

    // 50/50 chance to determine the direction boats are placed in,
    // let row_colChoice = (Math.random() >= 0.5)? 1 : 0; // 0: row, 1 col
    // let directionChoice = (Math.random() >= 0.5)? 1 : 0; // 0: up/right, 1: down/left
    if (!checkShipCells(x, y, row_col, up_down, length)) {
      throw new Error(`Invalid Placement`);
    }

    for (let i = 0; i < length; i++){
        if (row_col === 0) {
            if (up_down === 0) {
                board.p1_board[x][y].ship = newShip;
                board.p1_board[x][y].value = 1;
                y = y + 1;
            } else {
                board.p1_board[x][y].ship = newShip;
                board.p1_board[x][y].value = 1;
                y = y - 1;
            }
        } else {
            if (up_down === 0) {
                board.p1_board[x][y].ship = newShip;
                board.p1_board[x][y].value = 1;
                x = x - 1;
            } else {
                board.p1_board[x][y].ship = newShip;
                board.p1_board[x][y].value = 1;
                x = x + 1;
            }
        }
    }
  }

  return board.p1_board[x][y].ship;
}

function checkShipCells(x, y, row_col, up_down, length) {
  for (let i = 0; i < length; i++) {
    if (!board.checkCell(x, y)) {
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

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.value = 0;
    this.ship = null;
  }
}

module.exports = {board};
