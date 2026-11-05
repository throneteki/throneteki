import DrawCard from '../../drawcard.js';

class SummerSeaPort extends DrawCard {
    // Summer Sea Port (11056)
    // +1 Income. +1 Reserve.
    setupCardAbilities() {
        this.plotModifiers({
            gold: 1,
            reserve: 1
        });
    }
}

SummerSeaPort.code = '11056';

export default SummerSeaPort;
