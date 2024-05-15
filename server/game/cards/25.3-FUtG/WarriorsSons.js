import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WarriorsSons extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => event.card === this,
                onCardPowerMoved: (event) => event.target === this
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({
                card: context.event.card || context.event.target
            }))
        });
    }
}

WarriorsSons.code = '25045';

export default WarriorsSons;
