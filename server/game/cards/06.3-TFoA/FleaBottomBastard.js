import DrawCard from '../../drawcard.js';

class FleaBottomBastard extends DrawCard {
    // Flea Bottom Bastard (06047)
    // During the dominance phase, Flea Bottom Bastard gets +3 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'dominance',
            match: this,
            effect: ability.effects.modifyStrength(3)
        });
    }
}

FleaBottomBastard.code = '06047';

export default FleaBottomBastard;
