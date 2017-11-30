const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class Dorne extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller && this.controller.drawDeck.size() >= 2
            },
            handler: () => {
                this.top2Cards = this.controller.drawDeck.first(2);

                let buttons = _.map(this.top2Cards, card => {
                    return { method: 'cardSelected', card: card };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select card to add to hand',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, cardId) {
        let card = player.findCardByUuid(player.drawDeck, cardId);
        player.moveCard(card, 'hand');
        player.moveFromTopToBottomOfDrawDeck(1);

        this.game.addMessage('{0} uses {1} to look at the top 2 cards of their deck, draw 1 and place the other on the bottom of their deck',
            player, this);

        return true;
    }
}

Dorne.code = '10017';

module.exports = Dorne;
