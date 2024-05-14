const DrawCard = require('../../drawcard.js');

class NowMyWatchBegins extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.location === 'discard pile' &&
                    event.player !== this.controller &&
                    event.card.getType() === 'character' &&
                    event.card.getPrintedCost() <= 5 &&
                    this.controller.canPutIntoPlay(event.card)
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.event.card);

                this.game.addMessage(
                    '{0} uses {1} to put {2} into play under their control',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });
    }
}

NowMyWatchBegins.code = '07023';

module.exports = NowMyWatchBegins;
