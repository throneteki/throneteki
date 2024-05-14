const DrawCard = require('../../drawcard.js');

class Dorne extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    ['military', 'power'].includes(event.challenge.challengeType) &&
                    event.challenge.loser === this.controller
            },
            handler: () => {
                this.top2Cards = this.controller.drawDeck.slice(0, 2);

                let buttons = this.top2Cards.map((card) => {
                    return { method: 'cardSelected', card: card, mapCard: true };
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

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        player.moveFromTopToBottomOfDrawDeck(1);

        this.game.addMessage(
            '{0} uses {1} to look at the top 2 cards of their deck, add 1 to their hand and place the other on the bottom of their deck',
            player,
            this
        );

        return true;
    }
}

Dorne.code = '17113';

module.exports = Dorne;
