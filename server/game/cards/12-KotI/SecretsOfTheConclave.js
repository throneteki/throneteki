const PlotCard = require('../../plotcard');

class SecretsOfTheConclave extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: event => event.phase === 'challenge'
            },
            handler: context => {
                this.remainingCards = context.player.searchDrawDeck(5);
                let buttons = this.remainingCards.map(card => ({ method: 'selectCardForHand', card: card, mapCard: true }));

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
        this.remainingCards = this.remainingCards.filter(c => c !== card);
        this.controller.moveCard(card, 'hand');
        this.promptCardForDiscard();
        return true;
    }

    promptCardForDiscard() {
        let buttons = this.remainingCards.map(card => ({
            method: 'selectCardForDiscard', card: card, mapCard: true
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to discard',
                buttons: buttons
            },
            source: this
        });
    }

    selectCardForDiscard(player, card) {
        this.remainingCards = this.remainingCards.filter(c => c !== card);
        player.discardCard(card);
        this.promptToPlaceNextCard();

        return true;
    }

    promptToPlaceNextCard() {
        let buttons = this.remainingCards.map(card => ({
            method: 'selectCardForTop', card: card, mapCard: true
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on top of deck',
                buttons: buttons
            },
            source: this
        });
    }

    selectCardForTop(player, card) {
        this.remainingCards = this.remainingCards.filter(c => c !== card);
        this.controller.moveCard(card, 'draw deck');

        if(this.remainingCards.length > 0) {
            this.promptToPlaceNextCard();
        } else {
            this.game.addMessage('{0} uses {1} to look at the top 5 cards of their deck, add 1 to their hand, discard 1, and place the rest on top of their deck', this.controller, this);
        }

        return true;
    }
}

SecretsOfTheConclave.code = '12051';

module.exports = SecretsOfTheConclave;
