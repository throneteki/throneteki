import DrawCard from '../../drawcard.js';

class SerWillamWells extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icons from character',
            phase: 'challenge',
            cost: ability.costs.killSelf(),
            target: {
                cardCondition: { location: 'play area', type: 'character' }
            },
            message:
                '{player} kills {costs.kill} to remove a military, an intrigue, and a power icon from {target} until the end of the phase',
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: [
                        ability.effects.removeIcon('military'),
                        ability.effects.removeIcon('intrigue'),
                        ability.effects.removeIcon('power')
                    ]
                }));
            }
        });
    }
}

SerWillamWells.code = '25087';

export default SerWillamWells;
