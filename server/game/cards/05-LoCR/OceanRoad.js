import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class OceanRoad extends DrawCard {
    // Ocean Road (05042)
    // Limited.
    // Marshaling Action: Kneel Ocean Road to reduce the cost of the next neutral or out-of-faction
    // card you marshal this phase by 1.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message:
                '{player} uses {source} to reduce the cost of the next neutral or out of faction card by 1',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                condition: () => !context.abilityDeactivated,
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    1,
                    (card) =>
                        card.isFaction('neutral') ||
                        !card.isFaction(context.player.faction.getPrintedFaction())
                )
            }))
        });
    }
}

OceanRoad.code = '05042';

export default OceanRoad;
