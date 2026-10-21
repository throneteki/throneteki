import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class TourneyGrounds extends DrawCard {
    // Tourney Grounds (03042)
    // Action: Kneel Tourney Grounds to reduce the cost of the next event you play this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce event',
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            message:
                '{player} kneels {source} to reduce the cost of the next event they play this phase by 1',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                condition: () => !context.abilityDeactivated,
                targetController: 'current',
                effect: ability.effects.reduceNextPlayedCardCost(
                    1,
                    (card) => card.getType() === 'event'
                )
            }))
        });
    }
}

TourneyGrounds.code = '03042';

export default TourneyGrounds;
