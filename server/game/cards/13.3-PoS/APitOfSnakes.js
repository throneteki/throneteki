import DrawCard from '../../drawcard.js';

class APitOfSnakes extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place poison token',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getNumberOfIcons() === 0
            },
            handler: (context) => {
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.poison
                }));
            },
            max: ability.limit.perPhase(1)
        });
    }
}

APitOfSnakes.code = '13056';

export default APitOfSnakes;
