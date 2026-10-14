import DrawCard from '../../drawcard.js';

class ErikAnvilBreaker extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentPhase === 'standing',
            match: this,
            effect: ability.effects.cannotBeStood()
        });
    }
}

ErikAnvilBreaker.code = '00129';

export default ErikAnvilBreaker;
