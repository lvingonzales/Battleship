
class Ship {
    constructor (length){
        this.length = length;
        this.hp = length;
    }

    hit(){
        this.hp = this.hp - 1;
        this.isSunk(this.hp);
        return true;
    }

    isSunk(hp) {
        if (hp === 0){
            return true;
        } else {
            return false;
        }
    }
}

module.exports = {Ship}
