const PlotCard = require('../../plotcard.js');

class WheelsWithinWheels extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            message: '{player} uses {source} to search the top 10 cards of their deck for any number of events',
            handler: context => {
                this.cards = undefined;

                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    numToSelect: 10,
                    activePromptTitle: 'Select any number of events',
                    cardType: 'event',
                    onSelect: (player, cards, valids) => this.revealSelectedCards(player, cards, valids),
                    onCancel: player => this.cancelSelecting(player),
                    source: this
                });
            }
        });
    }

    revealSelectedCards(player, cards, valids) {
        if(valids.length > 0) {
            this.cards = valids;
    
            if(valids.length === 1) {
                this.game.addMessage('{0} adds {1} to their hand',
                    player, valids[0]);
    
                player.moveCard(valids[0], 'hand');
    
                return;
            }
    
            let buttons = valids.map(card => {
                return { card: card, method: 'resolve', mapCard: true };
            });
    
            this.game.promptWithMenu(player, this, {
                activePrompt: {
                    menuTitle: 'Select a card to draw',
                    buttons: buttons
                },
                source: this
            });
        }

        return true;
    }

    cancelSelecting(player) {
        this.game.addMessage('{0} does not retrieve any cards',
            player);
    }

    resolve(player, cardToHand) {
        player.moveCard(cardToHand, 'hand');
        this.cards = this.cards.filter(card => card !== cardToHand);

        for(let card of this.cards) {
            player.moveCard(card, 'discard pile');
        }

        this.game.addMessage('{0} adds {1} to their hand and places {2} in their discard pile',
            player, cardToHand, this.cards);

        return true;
    }
}

WheelsWithinWheels.code = '06100';

module.exports = WheelsWithinWheels;
