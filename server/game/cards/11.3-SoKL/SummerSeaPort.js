const DrawCard = require('../../drawcard.js');

class SummerSeaPort extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1,
            reserve: 1
        });
    }
}

SummerSeaPort.code = '11056';

module.exports = SummerSeaPort;
