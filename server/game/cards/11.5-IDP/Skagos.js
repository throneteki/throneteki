const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Skagos extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Replace standing Stark card',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrifice(
                    (card) =>
                        card.isFaction('stark') && !card.kneeled && card.location !== 'duplicate'
                )
            ],
            message:
                '{player} kneels {source} and sacrifices {costs.sacrifice} to search their deck for a card of the same title',
            gameAction: GameActions.search({
                title: 'Select a card',
                match: { condition: (card, context) => card.name === context.costs.sacrifice.name },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Skagos.code = '11082';

module.exports = Skagos;
