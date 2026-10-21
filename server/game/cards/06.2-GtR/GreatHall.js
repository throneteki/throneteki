import DrawCard from '../../drawcard.js';

class GreatHall extends DrawCard {
    // Great Hall (06038)
    // Limited.
    // Marshaling Action: Kneel Great Hall to reduce the cost of the next unique character you
    // marshal this phase by 1. (By 2 instead if that character's printed cost is 6 or higher.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next unique character',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let amount = (card) => (card.getPrintedCost() >= 6 ? 2 : 1);
                this.game.addMessage(
                    '{0} kneels {1} to reduce the cost of the next unique character by 1 (by 2 if it has cost of 6 or more)',
                    context.player,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        amount,
                        (card) => card.getType() === 'character' && card.isUnique()
                    )
                }));
            }
        });
    }
}

GreatHall.code = '06038';

export default GreatHall;
