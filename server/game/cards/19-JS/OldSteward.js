import DrawCard from '../../drawcard.js';

class OldSteward extends DrawCard {
    // Old Steward (19010)
    // +1 Reserve.
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
    }
}

OldSteward.code = '19010';

export default OldSteward;
