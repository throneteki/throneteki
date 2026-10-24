import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheKingsJustice extends DrawCard {
    // The King's Justice (26022)
    // Unique character only.
    // Reaction: After you win a [power] challenge, kneel attached character to choose and kill a
    // kneeling character controlled by the losing opponent.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power'
            },
            cost: ability.costs.kneelParent(),
            target: {
                cardCondition: {
                    location: 'play area',
                    kneeled: true,
                    condition: (card, context) => card.controller === context.event.challenge.loser
                }
            },
            message: '{player} uses {source} and kneels {costs.kneel} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

TheKingsJustice.code = '26022';

export default TheKingsJustice;
