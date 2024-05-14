const DrawCard = require('../../drawcard');

class LadyForlorn extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });

        this.whileAttached({
            match: (card) => card.name === 'Lyn Corbray',
            effect: ability.effects.addIcon('power')
        });
    }

    getSTR() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.getType() === 'location' && card.isFaction('neutral')
        );
    }
}

LadyForlorn.code = '14043';

module.exports = LadyForlorn;
