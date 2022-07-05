const DrawCard = require('../../drawcard.js');

class TywinLannister extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                'onCardDiscarded': event => this.exactlyOneCardDiscardedFromPlayersDeck(event)
            },
            message: {
                format: '{player} uses {source} to look at the top 2 cards of {discardingPlayer}\'s deck and discard 1',
                args: { discardingPlayer: context => context.event.card.controller }
            },
            handler: context => {
                this.eventObj = context.event;
                this.discardingPlayer = this.eventObj.card.controller;

                let top2Cards = this.discardingPlayer.drawDeck.slice(0, 2);
                let buttons = top2Cards.map(card => {
                    return { method: 'cardSelected', card: card, mapCard: true };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select which card to discard',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    exactlyOneCardDiscardedFromPlayersDeck(event) {
        // If there are no other concurrent events with the same controller being discarded from the draw deck, then exactly 1 card is being discarded from that players deck
        return event.originalLocation === 'draw deck' 
            && !(event.parentEvent && event.parentEvent.getConcurrentEvents().some(childEvent => childEvent.name === 'onCardDiscarded'
                                                                                    && childEvent !== event
                                                                                    && childEvent.card.controller === event.card.controller
                                                                                    && childEvent.originalLocation === 'draw deck'));
    }

    cardSelected(player, card) {
        this.eventObj.card = card;
        this.game.addMessage('{0} chooses to discard {1}', this.controller, card);

        return true;
    }
}

TywinLannister.code = '05006';

module.exports = TywinLannister;
