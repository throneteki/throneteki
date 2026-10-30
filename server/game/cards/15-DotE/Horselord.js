import DrawCard from '../../drawcard.js';

function getSTR(source) {
    let cards = source.controller.filterCardsInPlay(
        (card) => card.isAttacking() && card.hasTrait('Dothraki') && card !== source
    );
    return cards.length;
}

class Horselord extends DrawCard {
    // Horselord (15015)
    // While Horselord is attacking, it gets +1 STR for each other attacking Dothraki character you
    // control.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: this,
            effect: ability.effects.dynamicStrength((card, context) => getSTR(context.source))
        });
    }
}

Horselord.code = '15015';

export default Horselord;
