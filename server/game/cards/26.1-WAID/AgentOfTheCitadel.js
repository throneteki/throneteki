import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AgentOfTheCitadel extends DrawCard {
    // Agent of the Citadel (26015)
    // Reaction: After you win a challenge in which Agent of the Citadel is participating, reveal
    // the top card of your deck to reduce the cost of the next card you bring out of shadows this
    // phase by 2.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            cost: ability.costs.revealSpecific((context) => context.player.drawDeck[0]),
            message:
                '{player} uses {source} and reveals the top card of their deck to reduce the cost of the next card they bring out of shadows this phase by 2',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                targetController: 'current',
                effect: ability.effects.reduceNextOutOfShadowsCardCost(2)
            }))
        });
    }
}

AgentOfTheCitadel.code = '26015';

export default AgentOfTheCitadel;
