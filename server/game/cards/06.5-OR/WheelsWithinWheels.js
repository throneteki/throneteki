const PlotCard = require('../../plotcard.js');

class WheelsWithinWheels extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: context => {
                this.cards = undefined;

                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    numToSelect: 10,
                    activePromptTitle: 'Select any number of events',
                    cardType: 'event',
                    onSelect: (player, cards) => this.revealSelectedCards(player, cards),
                    onCancel: player => this.cancelSelecting(player),
                    source: this
                });
            }
        });
    }

    revealSelectedCards(player, cards) {
        this.cards = cards;

        if(cards.length === 1) {
            this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand',
                player, this, cards[0]);

            player.moveCard(cards[0], 'hand');

            return;
        }

        let buttons = cards.map(card => {
            return { card: card, method: 'resolve', mapCard: true };
        });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select a card to draw',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    cancelSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not retrieve any cards',
            player, this);
    }

    resolve(player, cardToHand) {
        player.moveCard(cardToHand, 'hand');
        this.cards = this.cards.filter(card => card !== cardToHand);

        for(let card of this.cards) {
            player.moveCard(card, 'discard pile');
        }

        this.game.addMessage('{0} uses {1} to add {2} to their hand and place {3} in their discard pile',
            player, this, cardToHand, this.cards);

        return true;
    }
}

WheelsWithinWheels.code = '06100';

module.exports = WheelsWithinWheels;
