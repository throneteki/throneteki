import DrawCard from '../../drawcard.js';

class AdvisorToTheCrown extends DrawCard {
    // Advisor to the Crown (13077)
    // Action: Kneel Advisor to the Crown to reduce the cost of the next Maester character you
    // marshal this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to reduce the cost of the next Maester character by 1',
                    this.controller,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        1,
                        (card) => card.getType() === 'character' && card.hasTrait('Maester')
                    )
                }));
            }
        });
    }
}

AdvisorToTheCrown.code = '13077';

export default AdvisorToTheCrown;
