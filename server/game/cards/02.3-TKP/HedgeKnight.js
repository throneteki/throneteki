import DrawCard from '../../drawcard.js';

function isControlAnotherKnight(source) {
    return source.controller.anyCardsInPlay(
        (card) => card.hasTrait('Knight') && card !== source && card.getType() === 'character'
    );
}

class HedgeKnight extends DrawCard {
    // Hedge Knight (02057)
    // While you control another Knight character, Hedge Knight gets +1 STR and gains a [power]
    // icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => isControlAnotherKnight(context.source),
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addIcon('power')]
        });
    }
}

HedgeKnight.code = '02057';

export default HedgeKnight;
