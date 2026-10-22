import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WinterfellHeartTree extends DrawCard {
    // Winterfell Heart Tree (03018)
    // Reaction: After a phase begins, sacrifice Winterfell Heart Tree to choose a [stark] card you
    // control. Until the end of the phase, that card gains "immune to opponents' plot effects."
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: { controller: 'current', faction: 'stark', location: 'play area' }
            },
            message:
                "{player} sacrifices {source} to grant {target} from opponents' plot effects until the end of the phase",
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.immuneTo(
                    (card) => card.controller !== context.player && card.getType() === 'plot'
                )
            }))
        });
    }
}

WinterfellHeartTree.code = '03018';

export default WinterfellHeartTree;
