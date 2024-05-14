import TitleCard from '../../TitleCard.js';

class MasterOfCoin extends TitleCard {
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
