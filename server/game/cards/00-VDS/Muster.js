const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

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

module.exports = Muster;
