import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShierakQiya extends DrawCard {
    // Shierak Qiya (04015)
    // Reaction: After you win a [power] challenge by 5 or more STR, kneel your faction card to
    // choose and stand a participating character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === context.source.controller &&
                    event.challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) => card.location === 'play area' && card.isParticipating(),
                gameAction: 'stand'
            },
            message: '{player} uses {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

ShierakQiya.code = '04015';

export default ShierakQiya;
