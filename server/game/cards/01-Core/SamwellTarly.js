import DrawCard from '../../drawcard.js';

class SamwellTarly extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
    }
}

SamwellTarly.code = '01127';

export default SamwellTarly;
