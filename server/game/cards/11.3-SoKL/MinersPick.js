import DrawCard from '../../drawcard.js';

class MinersPick extends DrawCard {
    // Miner's Pick (11046)
    // Builder or Steward character only.
    // Attached character gets +1 STR.
    // +1 Income.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: ['Builder', 'Steward'] });
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

MinersPick.code = '11046';

export default MinersPick;
