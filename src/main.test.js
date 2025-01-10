// const { Ship, board, addShip } = require("./main");

// test ('Ship should return true when sunk', () => {
//     let ship = new Ship(3);
//     ship.hit();
//     ship.hit();
//     ship.hit();
//     expect(ship.isSunk()).toBe(true);
// });

// test ('Ship.isSunk() should return false when not sunk', () => {
//     let ship = new Ship(3);
//     ship.hit();
//     ship.hit();
//     expect(ship.isSunk()).toBe(false);
// });

// test ('board.setCell should return 1,1', () => {
//     expect(board.setCell(1,1,1)).toBe(1,1);
// })

// test ('board.setCell(1,1,3) should return 3,3', () => {
//     expect(board.setCell(1,1,3)).toBe(3,3);
// })

// Test receive attack function

// const fillBoard = jest.fn(() => {
//   board.fillBoard();
// });

// test('Out of bound cell coordinates should return false, eg(12,13)', () => {
//     fillBoard();
//     expect(board.checkCell(12,13)).toBe(false);
// })

// test('Valid cell coordinates should return true, eg(3,3)', () => {
//     fillBoard();
//     expect(board.checkCell(3,3)).toBe(true);
// })

// test('Trying to shoot a cell with a value greater than 1 should return false', () => {
//     fillBoard();
//     board.receiveAttack(1,1);
//     expect(board.checkCell(1,1)).toBe(false);
// })

// test('Receiving an attack on an empty square should return the string "Shot cell: 1,1 ... MISS!"', () => {
//     fillBoard();
//     expect(board.receiveAttack(1,1)).toBe("Shot cell: 1,1 ... MISS!");
// })

// test('Receiving an attack on an occupied square should return the string "Shot cell: 3,3 ... SUNK!" if the boat sank', () => {
//     fillBoard();
//     expect(board.receiveAttack(3,3)).toBe("Shot cell: 3,3 ... SUNK!");
// })

// test('Receiving an attack on an occupied square should return the string "Shot cell: 3,3 ... HIT!" if the boat was hit but not sunk', () => {
//     fillBoard();
//     expect(board.receiveAttack(3,3)).toBe("Shot cell: 3,3 ... SUNK!");
// })

// Testing addShip() function
// test("Adding a ship that passes out of bounds throws an error. ie: addShip(0, 0, 1, 0, 2)", () => {
//   fillBoard();
//   expect(() => {
//     addShip(0, 0, 1, 0, 2);
//   }).toThrow();
// });

// not checking for an invalid initial cell as I plan to reuse checkCell() tested above

// test("Adding a ship to a valid cell that does not pass out of bounds should return a non null cell.ship property", () => {
//   fillBoard();
//   expect(addShip(1, 1, 1, 1, 1)).not.toBeNull();
// });

// test("trying to add a ship to a spot that contains another ship returns false", () => {
//     fillBoard();
//     addShip(1,1,1,1,1);
//     expect(board.checkCell(1,1)).toBe(false);
// })

// test("trying to add a ship to a spot that would cause it to overlap another ship throws an error", () => {
//     fillBoard();
//     addShip(1,1,1,1,1);
//     expect(() => {
//         addShip(1,3,0,1,3)
//     }).toThrow();
// })

// Testing Player class methods


const addShipSet = require('./main.js');


test (`addShipSet returns an array of objects that are instances of the Ship class`, () => {
    expect(addShipSet()[0]).toBeInstanceOf(Ship);
})
