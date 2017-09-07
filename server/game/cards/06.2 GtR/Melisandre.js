const DrawCard = require('../../drawcard.js');

class Melisandre extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: event => this.controller === event.winner
            },
            chooseOpponent: opponent => opponent.hand.size() >= 1,
            handler: context => {
                let otherPlayer = context.opponent;
                let buttons = otherPlayer.hand.map(card => {
                    return { method: 'cardSelected', card: card };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        let card = this.game.findAnyCardInAnyList(cardId);

        if(!card) {
            return false;
        }

        let otherPlayer = card.controller;

        otherPlayer.discardCards([card], true, () => {
            let charMessage = '';

            if(card.getType() === 'character') {
                charMessage = ' and place it in the dead pile';
                otherPlayer.moveCard(card, 'dead pile');
            }

            this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand{4}',
                player, this, card, otherPlayer, charMessage);
        });

        return true;
    }
}

Melisandre.code = '06027';

module.exports = Melisandre;
