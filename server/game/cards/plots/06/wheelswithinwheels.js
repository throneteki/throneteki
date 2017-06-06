const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WheelsWithinWheels extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    numToSelect: 10,
                    activePromptTitle: 'Select any number of cards to reveal',
                    cardType: 'event',
                    onSelect: (player, card) => this.cardsToReveal(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardsToReveal(player, card) {
        this.cards = this.cards || [];
        this.cards.push(card);
        player.moveCard(card, 'discard pile');
        
        return true;
    }

    doneSelecting(player) {
        if(_.isEmpty(this.cards)) {
            this.game.addMessage('{0} does not use {1} to reveal any cards', 
                                  player, this);
        
            return true;
        }

        if(this.cards.length === 1) {
            this.game.addMessage('{0} uses {1} to reveal and add {2} to their hand', 
                                player, this, this.cards[0]);

            player.moveCard(this.cards[0], 'hand');

            return true;
        }

        this.game.addMessage('{0} uses {1} to reveal {2}', player, this, this.cards);

        var buttons = _.map(this.cards, (card, i) => {
            return { card: card, method: 'resolve', arg: i };
        });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select a card to add to your hand',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    resolve(player, index) {
        let cardToHand = this.cards[index];
        player.moveCard(cardToHand, 'hand');
        this.cards.splice(index, 1);

        if(this.cards.length === 1) {
            this.game.addMessage('{0} uses {1} to add {2} to their hand, {3} is placed in their discard pile', 
                                  player, this, cardToHand, this.cards);

            return true;
        }

        this.game.addMessage('{0} uses {1} to add {2} to their hand, {3} are placed in their discard pile', 
                              player, this, cardToHand, this.cards);

        return true;
    }
}

WheelsWithinWheels.code = '06100';

module.exports = WheelsWithinWheels;
