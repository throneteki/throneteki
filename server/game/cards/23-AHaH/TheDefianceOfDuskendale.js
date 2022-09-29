const GameActions = require('../../GameActions/index.js');
const PlotCard = require('../../plotcard.js');

class TheDefianceOfDuskendale extends PlotCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardKneeled: event => event.card.getType() === 'location' && event.cause === 'assault'
            },
            message: {
                format: '{controller} is forced to discard {discard} from play for {source}',
                args: { controller: context => context.event.card.controller }
            },
            gameAction: GameActions.discardCard(context => ({ card: context.event.card }))
        });
    }
}

TheDefianceOfDuskendale.code = '23038';

module.exports = TheDefianceOfDuskendale;
