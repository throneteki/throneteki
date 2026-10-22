import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheWaterGardens extends DrawCard {
    // The Water Gardens (08017)
    // Action: Kneel The Water Gardens to reduce the cost of the next non-character card you
    // marshal, play, or ambush this phase by X. X is the number of plot cards in your used pile.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce non-character',
            condition: (context) => context.player.getNumberOfUsedPlots() > 0,
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to reduce the cost of the next non-character card they marshal, play, or ambush by {amount}',
                args: { amount: (context) => context.player.getNumberOfUsedPlots() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                condition: () => !context.abilityDeactivated,
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledPlayedOrAmbushedCardCost(
                    context.player.getNumberOfUsedPlots(),
                    (card) => card.getType() !== 'character'
                )
            }))
        });
    }
}

TheWaterGardens.code = '08017';

export default TheWaterGardens;
