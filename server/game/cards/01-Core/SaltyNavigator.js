import DrawCard from '../../drawcard.js';

class SaltyNavigator extends DrawCard {
    // Salty Navigator (01076)
    // +1 Initiative.
    setupCardAbilities() {
        this.plotModifiers({
            initiative: 1
        });
    }
}

SaltyNavigator.code = '01076';

export default SaltyNavigator;
