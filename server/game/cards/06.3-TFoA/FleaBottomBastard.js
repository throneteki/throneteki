import DrawCard from '../../drawcard.js';

class FleaBottomBastard extends DrawCard {
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
