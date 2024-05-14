import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Muster extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck for Knight',
            phase: 'marshal',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Knight') && card.getType() === 'character'
            ),
            message:
                '{player} plays {source} and kneels {costs.kneel} to search their deck for a Knight character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { trait: 'Knight' },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Muster.code = '00019';

export default Muster;
