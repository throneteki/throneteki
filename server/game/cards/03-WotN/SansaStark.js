import DrawCard from '../../drawcard.js';

class SansaStark extends DrawCard {
    // Sansa Stark (03013)
    // Sansa Stark gets -1 STR for each [stark] character in your dead pile.
    // While Sansa Stark's STR is 0, she gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === this,
            effect: ability.effects.dynamicDecreaseStrength(() => this.calculateStrength())
        });
        this.persistentEffect({
            condition: () => this.getStrength() === 0,
            match: (card) => card === this,
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
