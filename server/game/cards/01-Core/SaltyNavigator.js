import DrawCard from '../../drawcard.js';

class SaltyNavigator extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });
    }
}

SaltyNavigator.code = '01076';

export default SaltyNavigator;
