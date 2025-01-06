const {Player} = require('./players_module');

test ('Retrieving Player Board should not return null or undefined', () =>{
    let player1 = new Player('human', 0);
    expect(player1.getBoard()).not.toBeUndefined();
    expect(player1.getBoard()).not.toBeNull();
})
