const TitleCard = require('../../TitleCard.js');

class MasterOfCoin extends TitleCard {
    setupCardAbilities() {
        // TODO: Rivals + Supports
        this.plotModifiers({
            gold: 2
        });
    }
}

MasterOfCoin.code = '01209';

module.exports = MasterOfCoin;
