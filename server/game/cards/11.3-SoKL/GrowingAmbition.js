const DrawCard = require('../../drawcard');

class GrowingAmbition extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search deck',
            phase: 'challenge',
            cost: ability.costs.payXGold(() => 1, () => this.controller.drawDeck.length),
            chooseOpponent: true,
            handler: context => {
                this.chosenCards = [];

                this.game.promptForDeckSearch(this.controller, {
                    numToSelect: context.xValue,
                    onSelect: (player, card) => this.cardSelected(player, card),
                    source: this
                });

                this.game.queueSimpleStep(() => {
                    this.returnCards(context);
                });
            }
        });
    }

    cardSelected(player, card) {
        this.chosenCards = this.chosenCards || [];
        this.chosenCards.push(card);
        player.removeCardFromPile(card);
    }

    returnCards(context) {
        if(this.chosenCards.length === 0) {
            this.game.addMessage('{0} plays {1} to search their deck, but chooses no cards.', context.player, this);
            return;
        }

        this.game.addMessage('{0} plays {1} to choose {2}, search their deck and place {3} in their discard pile',
            context.player, this, context.opponent, this.chosenCards);

        for(let card of this.chosenCards) {
            context.player.moveCard(card, 'discard pile');
        }

        this.game.promptForSelect(context.opponent, {
            mode: 'exactly',
            activePromptTitle: `Select ${context.xValue} card(s)`,
            cardCondition: card => card.controller === this.controller && card.location === 'discard pile',
            numCards: context.xValue,
            source: this,
            onSelect: (player, cards) => this.onCardsSelected(player, cards)
        });
    }

    onCardsSelected(player, cards) {
        for(let card of cards) {
            this.controller.moveCard(card, 'hand');
        }

        this.game.addMessage('{0} chooses to return {1} to {2}\'s hand for {3}',
            player, cards, this.controller, this);

        this.chosenCards = [];
        return true;
    }
}

GrowingAmbition.code = '11044';

module.exports = GrowingAmbition;
