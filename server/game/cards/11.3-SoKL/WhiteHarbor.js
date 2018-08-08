const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class WhiteHarbor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.controller.drawDeck.length >= 2
            },
            handler: context => {
                this.top2Cards = this.controller.drawDeck.slice(0, Math.min(2, this.controller.drawDeck.length));
                this.game.addMessage('{0} uses {1} to reveal {2} as the top {3} of their deck',
                    context.player, this, this.top2Cards, TextHelper.count(this.top2Cards.length, 'card'));

                let buttons = this.top2Cards.map(card => {
                    return { method: 'cardSelected', card: card, mapCard: true };
                });

                this.game.promptWithMenu(context.event.challenge.loser, this, {
                    activePrompt: {
                        menuTitle: `Select card to add to ${context.player.name}'s hand`,
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.controller.moveCard(card, 'hand');
        this.controller.moveFromTopToBottomOfDrawDeck(1);

        this.game.addMessage('{0} chooses {1} to add to {2}\'s hand', player, card, this.controller);

        return true;
    }
}

WhiteHarbor.code = '11042';

module.exports = WhiteHarbor;
