import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KnightOfTheReach extends DrawCard {
    // Knight of the Reach (06023)
    // Reaction: After you win a challenge in which Knight of the Reach is attacking or defending
    // alone, choose a Lady character. That character gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        attackingAlone: context.source
                    }) ||
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        defendingAlone: context.source
                    })
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('Lady') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            message: '{player} uses {source} to have {target} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
        });
    }
}

KnightOfTheReach.code = '06023';

export default KnightOfTheReach;
