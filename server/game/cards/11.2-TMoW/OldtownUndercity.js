const DrawCard = require('../../drawcard');

class OldtownUndercity extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.remainingCards = context.player.searchDrawDeck(3);
                let buttons = this.remainingCards.map((card) => ({
                    method: 'selectCardForHand',
                    card: card,
                    mapCard: true
                }));

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose a card to add to your hand',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    selectCardForHand(player, card) {
        this.remainingCards = this.remainingCards.filter((c) => c !== card);
        this.controller.moveCard(card, 'hand');
        this.promptCardForBottom();
        return true;
    }

    promptCardForBottom() {
        let buttons = this.remainingCards.map((card) => ({
            method: 'selectCardForBottom',
            card: card,
            mapCard: true
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
        });
    }

    selectCardForBottom(player, card) {
        this.remainingCards = this.remainingCards.filter((c) => c !== card);
        player.moveCard(card, 'draw deck', { bottom: true });

        let finalCard = this.remainingCards[0];

        if (!finalCard) {
            return false;
        }

        player.moveCard(this.remainingCards[0], 'draw deck');

        this.game.addMessage(
            '{0} uses {1} to look at the top three cards of their deck, adds 1 to their hand, places one on the bottom of their deck and places the other on top of their deck',
            player,
            this
        );

        return true;
    }
}

OldtownUndercity.code = '11024';

module.exports = OldtownUndercity;
