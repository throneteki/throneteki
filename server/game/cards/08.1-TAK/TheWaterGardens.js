import DrawCard from '../../drawcard.js';

class TheWaterGardens extends DrawCard {
    // The Water Gardens (08017)
    // Action: Kneel The Water Gardens to reduce the cost of the next non-character card you
    // marshal, play, or ambush this phase by X. X is the number of plot cards in your used pile.
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

export default TheWaterGardens;
