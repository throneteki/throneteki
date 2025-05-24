import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MilkwaterCrossing extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: [ability.costs.kneelSelf(), ability.costs.sacrificeSelf()],
            message:
                '{player} kneels and sacrifices {costs.sacrifice} to have each character lose all keywords and immunities until the end of the phase',
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfPhase((ability) => ({
                    targetController: 'any',
                    match: this.game.filterCardsInPlay((card) => card.getType() === 'character'),
                    effect: [
                        ability.effects.losesAllKeywords(),
                        ability.effects.losesAllImmunities()
                    ]
                }));
            })
        });
    }
}

MilkwaterCrossing.code = '26018';

export default MilkwaterCrossing;
