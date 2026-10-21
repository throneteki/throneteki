import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HouseBannerman extends DrawCard {
    // House Bannerman (00005)
    // Marshaling Action: Kneel House Bannerman to reduce the cost of the next in-faction character
    // you marshal this phase by 1.
    // Draft format only.
    setupCardAbilities(ability) {
        this.action({
            title: 'Reduce character cost',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to reduce the cost of the next {faction} character by 1',
                args: { faction: (context) => context.player.getFaction() }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                condition: () => !context.abilityDeactivated,
                targetController: 'current',
                effect: ability.effects.reduceNextMarshalledCardCost(
                    1,
                    (card) =>
                        card.isFaction(context.player.getFaction()) &&
                        card.getType() === 'character'
                )
            }))
        });
    }
}

HouseBannerman.code = '00005';

export default HouseBannerman;
