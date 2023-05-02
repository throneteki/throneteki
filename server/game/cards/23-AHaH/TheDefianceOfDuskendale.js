const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class TheDefianceOfDuskendale extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: event => event.card.getType() === 'location' && event.reason === 'assault'
            },
            message: {
                format: '{player} uses {source} to discard {location}',
                args: { location: context => context.event.card }
            },
            gameAction: GameActions.discardCard(context => ({ card: context.event.card }))
        });
    }
}

TheDefianceOfDuskendale.code = '23038';

module.exports = TheDefianceOfDuskendale;
