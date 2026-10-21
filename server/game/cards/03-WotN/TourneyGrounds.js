import DrawCard from '../../drawcard.js';

class TourneyGrounds extends DrawCard {
    // Tourney Grounds (03042)
    // Action: Kneel Tourney Grounds to reduce the cost of the next event you play this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce event',
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextPlayedCardCost(
                        1,
                        (card) => card.getType() === 'event'
                    )
                }));

                this.game.addMessage(
                    '{0} kneels {1} to reduce the cost of the next event they play this phase by 1',
                    this.controller,
                    this
                );
            }
        });
    }
}

TourneyGrounds.code = '03042';

export default TourneyGrounds;
