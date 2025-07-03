import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheKingsJustice extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
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
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.kill((context) => ({ card: context.target })),
                    context
                );
            }
        });
    }
}

TheKingsJustice.code = '26022';

export default TheKingsJustice;
