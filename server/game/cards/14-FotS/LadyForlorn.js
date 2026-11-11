import DrawCard from '../../drawcard.js';

class LadyForlorn extends DrawCard {
    // Lady Forlorn (14043)
    // Attached character gets +1 STR for each neutral location you control.
    // If attached character is Lyn Corbray, he gains a [power] icon.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.dynamicStrength((card, context) => context.source.getSTR())
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

export default LadyForlorn;
