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
                    activePromptTitle: `Select ${context.xValue} cards`,
                    onSelect: (player, cards) => this.selectCards(cards, context),
                    onCancel: () => this.selfCancelSearch(context),
                    source: this
                });
            }
        });
    }

    selectCards(cards, context) {
        this.game.addMessage('{0} plays {1} to choose {2}, search their deck and place {3} in their discard pile',
            context.player, this, context.opponent, cards);

        for(let card of cards) {
            context.player.moveCard(card, 'discard pile');
        }

        this.game.promptForSelect(context.opponent, {
            mode: 'exactly',
            activePromptTitle: `Select ${context.xValue} card(s)`,
            cardCondition: card => card.controller === this.controller && card.location === 'discard pile',
            numCards: context.xValue,
            source: this,
            onSelect: (player, cards) => this.opponentSelectCards(player, cards),
            onCancel: (player) => this.opponentCancel(player)
        });
    }

    selfCancelSearch(context) {
        this.game.addMessage('{0} play {1} to search their deck, but chooses no cards', context.player, this);
    }

    opponentSelectCards(player, cards) {
        for(let card of cards) {
            this.controller.moveCard(card, 'hand');
        }

        this.game.addMessage('{0} chooses to return {1} to {2}\'s hand for {3}',
            player, cards, this.controller, this);

        return true;
    }

    opponentCancel(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
        return true;
    }
}

GrowingAmbition.code = '11044';

module.exports = GrowingAmbition;
