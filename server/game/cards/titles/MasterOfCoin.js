import TitleCard from '../../TitleCard.js';

class MasterOfCoin extends TitleCard {
    // Master of Coin (01209)
    // Supported by Master of Laws.
    // Supports: Master of Ships
    // Rivals: Hand of the King, Master of Whispers
    // +2 Income.
    setupCardAbilities() {
        this.supports('Master of Ships');
        this.rivals('Hand of the King', 'Master of Whispers');
        this.plotModifiers({
            gold: 2
        });
    }
}

MasterOfCoin.code = '01209';

export default MasterOfCoin;
