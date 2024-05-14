const DrawCard = require('../../drawcard');

class HouseBannerman extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce character cost',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.addMessage(
                    '{0} kneels {1} to reduce the cost of the next {2} character by 1',
                    this.controller,
                    this,
                    this.controller.getFaction()
                );
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        1,
                        (card) =>
                            card.isFaction(this.controller.getFaction()) &&
                            card.getType() === 'character'
                    )
                }));
            }
        });
    }
}

HouseBannerman.code = '00005';

module.exports = HouseBannerman;
