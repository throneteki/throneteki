import DrawCard from '../../drawcard.js';

class ErikAnvilBreaker extends DrawCard {
    // Erik Anvil-Breaker (22004)
    // Intimidate. Pillage. Renown.
    // Erik Anvil-Breaker cannot stand during the standing phase.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.currentPhase === 'standing',
            match: this,
            effect: ability.effects.cannotBeStood()
        });
    }
}

ErikAnvilBreaker.code = '22004';

export default ErikAnvilBreaker;
