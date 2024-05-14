const DrawCard = require('../../drawcard');

class TheWaterGardens extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce non-character',
            condition: () => this.controller.getNumberOfUsedPlots() > 0,
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    condition: () => !context.abilityDeactivated,
                    effect: ability.effects.reduceNextMarshalledPlayedOrAmbushedCardCost(
                        context.player.getNumberOfUsedPlots(),
                        (card) => card.getType() !== 'character'
                    )
                }));

                this.game.addMessage(
                    '{0} kneels {1} to reduce the cost of the next non-character card they marshal, play, or ambush by {2}',
                    context.player,
                    this,
                    context.player.getNumberOfUsedPlots()
                );
            }
        });
    }
}

TheWaterGardens.code = '08017';

module.exports = TheWaterGardens;
