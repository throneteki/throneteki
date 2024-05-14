import DrawCard from '../../drawcard.js';

class WinterfellHeartTree extends DrawCard {
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
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.immuneTo(
                        (card) => card.controller !== context.player && card.getType() === 'plot'
                    )
                }));
            }
        });
    }
}

WinterfellHeartTree.code = '03018';

export default WinterfellHeartTree;
