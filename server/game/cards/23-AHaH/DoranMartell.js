const DrawCard = require('../../drawcard.js');

class DoranMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'shadows',
            effect: ability.effects.dynamicKeywords(card => [`Shadow (${card.getPrintedCost()})`])
        });

        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner && this.controller !== event.winner
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to look at the top 2 cards of their deck', context.player, this);
                this.top2Cards = context.player.drawDeck.slice(0, 2);
    
                let buttons = this.top2Cards.map(card => {
                    return { method: 'cardSelected', card: card, mapCard: true };
                });
    
                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select card to place into shadows',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'shadows');
        player.moveFromTopToBottomOfDrawDeck(1);

        this.game.addMessage('{0} places 1 card into shadows, and places the other on the bottom of their deck', player, this);

        return true;
    }
}

DoranMartell.code = '23007';

module.exports = DoranMartell;
