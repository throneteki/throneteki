import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AgentOfTheCitadel extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            cost: ability.costs.revealSpecific((context) => context.player.drawDeck[0]),
            message:
                '{player} uses {source} and reveals the top card of their deck to reduce the cost of the next card they bring out of shadows this phase by 2',
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'current',
                    effect: ability.effects.reduceNextOutOfShadowsCardCost(2)
                }));
            })
        });
    }
}

AgentOfTheCitadel.code = '26015';

export default AgentOfTheCitadel;
