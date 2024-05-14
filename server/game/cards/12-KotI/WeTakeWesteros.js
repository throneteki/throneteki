const PlotCard = require('../../plotcard.js');

class WeTakeWesteros extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.getType() === 'location' &&
                    card.location === 'discard pile' &&
                    context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    "{0} uses {1} to put {2} into play from {3}'s discard pile ",
                    context.player,
                    this,
                    context.target,
                    context.target.owner
                );
            }
        });
    }
}

WeTakeWesteros.code = '12046';

module.exports = WeTakeWesteros;
