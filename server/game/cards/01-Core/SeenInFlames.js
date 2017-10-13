const DrawCard = require('../../drawcard.js');

class SeenInFlames extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard from opponent\'s hand',
            phase: 'challenge',
            condition: () => this.controller.anyCardsInPlay(card => card.hasTrait('R\'hllor') && card.getType() === 'character'),
            chooseOpponent: opponent => !opponent.hand.isEmpty(),
            handler: context => {
                let buttons = context.opponent.hand.map(card => {
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

        otherPlayer.discardCard(card);

        this.game.addMessage('{0} plays {1} to discard {2} from {3}\'s hand', player, this, card, otherPlayer);

        return true;
    }
}

SeenInFlames.code = '01064';

module.exports = SeenInFlames;
