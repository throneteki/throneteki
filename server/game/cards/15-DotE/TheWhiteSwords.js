const PlotCard = require('../../plotcard');

class TheWhiteSwords extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                type: 'select',
                cardCondition: (card, context) => (
                    card.getType() === 'character' &&
                    card.hasTrait('Kingsguard') &&
                    card.controller === context.player &&
                    ['hand', 'discard pile'].includes(card.location) &&
                    context.player.canPutIntoPlay(card)
                )
            },
            message: {
                format: '{player} uses {source} to put {target} into play from their {originalLocation}',
                args: { originalLocation: context => context.target.location }
            },
            handler: context => {
                context.player.putIntoPlay(context.target);
            }
        });
    }
}

TheWhiteSwords.code = '15048';

module.exports = TheWhiteSwords;
