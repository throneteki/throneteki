const DrawCard = require('../../drawcard.js');

class ToGoForwardYouMustGoBack extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Shuffle hand',
            phase: 'dominance',
            condition: () => this.game.getPlayers().some(player => this.hasHand(player)),
            handler: () => {
                this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
                this.selections = [];
                this.proceedToNextStep();
            }
        });
    }

    hasHand(player) {
        return player.hand.length > 0;
    }

    proceedToNextStep() {
        if(this.remainingPlayers.length > 0) {
            let currentPlayer = this.remainingPlayers.shift();
            if(!this.hasHand(currentPlayer)) {
                this.proceedToNextStep();
                return true;
            }

            this.game.promptWithMenu(currentPlayer, this, {
                activePrompt: {
                    menuTitle: 'Shuffle your hand to draw 5 cards?',
                    buttons: [
                        { text: 'Yes', method: 'shuffleHand' },
                        { text: 'No', method: 'cancel' }
                    ]
                },
                source: this
            });
        }
    }

    shuffleHand(player) {
        for(let card of player.hand) {
            player.moveCard(card, 'draw deck');
        }
        player.shuffleDrawDeck();
        let cards = player.drawCardsToHand(5).length;

        this.game.addMessage('{0} uses {1} to shuffle their hand into their draw deck and draw {2} {3}',
            this.controller, this, cards, cards > 1 ? 'cards' : 'card');
        this.proceedToNextStep();
        return true;
    }

    cancel() {
        this.proceedToNextStep();
        return true;
    }
}

ToGoForwardYouMustGoBack.code = '08114';

module.exports = ToGoForwardYouMustGoBack;
