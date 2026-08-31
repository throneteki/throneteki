import DrawCard from '../../drawcard.js';

class OldSteward extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
    }
}

OldSteward.code = '00216';

export default OldSteward;
