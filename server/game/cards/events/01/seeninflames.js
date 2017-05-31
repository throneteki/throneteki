const DrawCard = require('../../../drawcard.js');

class SeenInFlames extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard from opponent\'s hand',
            phase: 'challenge',
            condition: () => (
                this.controller.anyCardsInPlay(card => card.hasTrait('R\'hllor')) &&
                this.opponentHasCards()
            ),
            handler: context => {
                let otherPlayer = this.game.getOtherPlayer(context.player);
                if(!otherPlayer) {
                    return;
                }

                let buttons = otherPlayer.hand.map(card => {
                    return { method: 'cardSelected', card: card };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a card to discard',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    opponentHasCards() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        return otherPlayer && !otherPlayer.hand.isEmpty();
    }

    cardSelected(player, cardId) {
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return false;
        }

        var card = otherPlayer.findCardByUuid(otherPlayer.hand, cardId);
        if(!card) {
            return false;
        }

        otherPlayer.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', player, this, card, otherPlayer);

        return true;
    }
}

SeenInFlames.code = '01064';

module.exports = SeenInFlames;
