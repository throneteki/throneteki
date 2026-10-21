import DrawCard from '../../drawcard.js';

class SamwellTarly extends DrawCard {
    // Samwell Tarly (01127)
    // Insight.
    // +1 Reserve.
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
    }
}

SamwellTarly.code = '01127';

export default SamwellTarly;
