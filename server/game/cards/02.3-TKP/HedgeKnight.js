import DrawCard from '../../drawcard.js';

class HedgeKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isControlAnotherKnight(),
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
