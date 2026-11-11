import DrawCard from '../../drawcard.js';

class SansaStark extends DrawCard {
    // Sansa Stark (03013)
    // Sansa Stark gets -1 STR for each [stark] character in your dead pile.
    // While Sansa Stark's STR is 0, she gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicDecreaseStrength((card, context) =>
                context.source.calculateStrength()
            )
        });
        this.persistentEffect({
            condition: (context) => context.source.getStrength() === 0,
            match: (card, context) => card === context.source,
            effect: ability.effects.addKeyword('Insight')
        });
    }

    calculateStrength() {
        return this.controller.deadPile.reduce((count, card) => {
            if (card.isFaction('stark')) {
                return count + 1;
            }

            return count;
        }, 0);
    }
}

SansaStark.code = '03013';

export default SansaStark;
