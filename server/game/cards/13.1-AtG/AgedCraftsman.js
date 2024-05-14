const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class AgedCraftsman extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for a location',
            gameAction: GameActions.search({
                title: 'Select a location',
                topCards: 10,
                match: { type: 'location', printedCostOrLower: 2, faction: 'thenightswatch' },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

AgedCraftsman.code = '13005';

module.exports = AgedCraftsman;
