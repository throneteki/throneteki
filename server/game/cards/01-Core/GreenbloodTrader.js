const DrawCard = require('../../drawcard.js');

class GreenbloodTrader extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            handler: () => {
                this.top2Cards = this.controller.drawDeck.slice(
                    0,
                    Math.min(2, this.controller.drawDeck.length)
                );

                let buttons = this.top2Cards.map((card) => {
                    return { method: 'cardSelected', card: card, mapCard: true };
                });

                buttons.push({ text: 'Continue', method: 'continueWithoutSelecting' });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Add a card to hand?',
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
            '{0} uses {1} to draw 2 cards, keep 1 and place the other on the bottom of their deck',
            player,
            this
        );

        return true;
    }

    moveToBottom(player, card) {
        let otherCard = this.top2Cards.find((c) => {
            return c.uuid !== card.uuid;
        });

        if (otherCard) {
            player.moveCard(otherCard, 'draw deck', { bottom: true });
        }

        player.moveCard(card, 'draw deck', { bottom: true });

        this.game.addMessage(
            '{0} uses {1} to draw 2 cards, and place them on the bottom of their deck',
            player,
            this
        );

        return true;
    }

    continueWithoutSelecting(player) {
        if (this.top2Cards.length === 1) {
            return this.moveToBottom(player, this.top2Cards[0]);
        }

        let buttons = this.top2Cards.map((card) => {
            return { method: 'moveToBottom', card: card, mapCard: true };
        });

        buttons.push({ text: 'Cancel', method: 'cancel' });

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select card to place on the bottom of the deck',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    cancel(player) {
        this.game.addAlert('danger', '{0} does not complete the resolution of {1}', player, this);

        return true;
    }
}

GreenbloodTrader.code = '01112';

module.exports = GreenbloodTrader;
