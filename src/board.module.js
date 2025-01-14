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

  addShip(start, direction, board = this.board) {
    if (row_col > 1 || row_col < 0 || up_down > 1 || up_down < 0) {
      throw new Error(`Invalid Direction`);
    }
    if (board[x][y].value === 0) {
      let newShip = new Ship(length);

      // 50/50 chance to determine the direction boats are placed in,
      // let row_colChoice = (Math.random() >= 0.5)? 1 : 0; // 0: row, 1 col
      // let directionChoice = (Math.random() >= 0.5)? 1 : 0; // 0: up/right, 1: down/left
      let validCells = this.getValidCells(start, direction, length);
      validCells.forEach(validCell => {
        if (validCell.valid){
          validCell.cell.ship = newShip;
        } else if (!validCell.cell.valid){
          validCell.cell.
        }
      })
    }

    return true;
  }

  getValidCells(start, direction, length) {
    let cells = [];
    let currentCell = start;

    if (!this.checkCell(currentCell)) {
      cells.push({ cell: currentCell, valid: false });
    } else {
      cells.push({ cell: currentCell, valid: true });
    }

    for (let i = 0; i < length - 1; i++) {
      if (!this.checkCell(currentCell)) {
        cells.push({ cell: currentCell, valid: false });
      }
      if (direction === 0) {
        currentCell = this.getCell(currentCell.x, currentCell.y + 1);
      } else {
        currentCell = this.getCell(currentCell.x - 1, currentCell.y);
      }
      cells.push({ cell: currentCell, valid: true });
    }
    return cells;
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

export { gameBoard, Ship };
