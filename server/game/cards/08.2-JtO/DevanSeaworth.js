const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class DevanSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: event => event.winner === this.controller
            },
            cost: ability.costs.discardXGold(() => this.getMinimumDiscardGoldAmount(), () => 99),
            handler: context => {
                let xValue = context.xValue;
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card => card.getType() === 'location' && !card.isLimited() && card.getPrintedCost() <= context.xValue && this.controller.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(player, card, xValue),
                    onCancel: player => this.doneSelecting(player, xValue),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, xValue) {
        player.putIntoPlay(card, 'hand');
        this.game.addMessage('{0} discards {1} gold from {2} to search their deck and put {3} into play',
            player, xValue, this, card);
    }

    doneSelecting(player, xValue) {
        this.game.addMessage('{0} discards {1} gold from {2} to search their deck, but does not put any card into play',
            player, xValue, this);
    }

    getMinimumDiscardGoldAmount() {
        let deckLocations = this.controller.drawDeck.filter(card => card.getType() === 'location');
        let deckCosts = _.map(deckLocations, card => card.getPrintedCost());
        let lowestCost = _.min(deckCosts);

        return _.max([lowestCost, 1]);
    }
}

DevanSeaworth.code = '08027';

module.exports = DevanSeaworth;
