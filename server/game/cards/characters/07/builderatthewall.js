const DrawCard = require('../../../drawcard');

class BuilderAtTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.addMessage('{0} kneels {1} to reduce the cost of the next {2} attachment or location by 1',
                                      this.controller, this, 'thenightswatch');
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        1,
                        card => card.isFaction('thenightswatch') && (card.getType() === 'attachment' || card.getType() === 'location')
                    )
                }));
            }
        });
    }
}

BuilderAtTheWall.code = '07016';

module.exports = BuilderAtTheWall;
