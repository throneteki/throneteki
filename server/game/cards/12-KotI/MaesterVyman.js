import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaesterVyman extends DrawCard {
    // Maester Vyman (12033)
    // Reaction: After you win a [military] or [power] challenge, kneel Maester Vyman to choose
    // another character that shares a Trait with him. That character gains 1 power.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        winner: context.source.controller,
                        challengeType: ['military', 'power']
                    })
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card !== context.source &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getTraits().some((trait) => context.source.hasTrait(trait)),
                gameAction: 'gainPower'
            },
            message: '{player} kneels {source} to have {target} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
        });
    }
}

MaesterVyman.code = '12033';

export default MaesterVyman;
