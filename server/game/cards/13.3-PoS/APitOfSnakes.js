import DrawCard from '../../drawcard.js';

class APitOfSnakes extends DrawCard {
    // A Pit of Snakes (13056)
    // Challenges Action: Choose a character with no challenge icons and place a poison token on it.
    // At the end of the phase, if that character still has that poison token, remove it and kill
    // that character. (Max 1 per phase.)
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
