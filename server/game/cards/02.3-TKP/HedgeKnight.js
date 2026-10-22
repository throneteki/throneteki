import DrawCard from '../../drawcard.js';

class HedgeKnight extends DrawCard {
    // Hedge Knight (02057)
    // While you control another Knight character, Hedge Knight gets +1 STR and gains a [power]
    // icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isControlAnotherKnight(),
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addIcon('power')]
        });
    }

    isControlAnotherKnight() {
        return this.controller.anyCardsInPlay(
            (card) => card.hasTrait('Knight') && card !== this && card.getType() === 'character'
        );
    }
}

HedgeKnight.code = '02057';

export default HedgeKnight;
