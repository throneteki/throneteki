import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class BrightWaterKnight extends DrawCard {
    // Brightwater Knight (08023)
    // Bestow (3).
    // Marshaling Action: Discard 1 gold from Brightwater Knight to reduce the cost of the next
    // Knight character you marshal this phase by 2. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce Knight character',
            clickToActivate: true,
            phase: 'marshal',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.discardGold(),
            message:
                '{player} discards 1 gold from {source} to reduce the next knight character they marshal this phase by 2',
            gameAction: GameActions.lastingEffect(() => ({
                duration: 'untilEndOfPhase',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    2,
                    (card) => card.getType() === 'character' && card.hasTrait('Knight')
                )
            }))
        });
    }
}

BrightWaterKnight.code = '08023';

export default BrightWaterKnight;
