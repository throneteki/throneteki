import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Sweetrobin extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardRevealed: (event) =>
                    event.card.hasPrintedCost() &&
                    event.card.getPrintedCost() <= event.card.owner.getTotalInitiative() &&
                    ['hand', 'draw deck', 'shadows'].includes(event.card.location)
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to remove {revealed} from the game',
                args: { revealed: (context) => context.event.card }
            },
            gameAction: GameActions.removeFromGame((context) => ({ card: context.event.card }))
        });
    }
}

Sweetrobin.code = '23028';

export default Sweetrobin;
