const {Ship} = require('./main');

test ('Ship should return true when sunk', () => {
    let ship = new Ship(3);
    expect(ship.isSunk(0)).toBe(true);
});
