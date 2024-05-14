const DrawCard = require('../../drawcard');

class Squire extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce next marshalled character',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let amount = (card) => (card.getPrintedCost() >= 6 ? 2 : 1);
                this.game.addMessage(
                    '{0} kneels {1} to reduce the cost of the next Army or Knight character by 1 (by 2 if it has cost of 6 or more)',
                    context.player,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        amount,
                        (card) =>
                            card.getType() === 'character' &&
                            (card.hasTrait('Army') || card.hasTrait('Knight'))
                    )
                }));
            }
        });
    }
}

Squire.code = '21027';

module.exports = Squire;
