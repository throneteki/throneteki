const DrawCard = require('../../drawcard.js');

class SacrificeToTheRedGod extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for a character',
            phase: 'marshal',
            cost: ability.costs.sacrifice(card => card.getType() === 'character'),
            condition: () => this.controller.anyCardsInPlay(card => card.hasTrait('R\'hllor') && card.getType() === 'character'),
            handler: context => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card',
                    cardCondition: card =>
                        card.getType() === 'character' &&
                        card.hasTrait('R\'hllor') &&
                        card.getPrintedCost() <= context.costs.sacrifice.getPrintedCost(),
                    onSelect: (player, card) => this.cardSelected(player, context.costs.sacrifice, card),
                    onCancel: player => this.doneSelecting(player, context.costs.sacrifice),
                    source: this
                });
            }
        });
    }

    cardSelected(player, cost, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} plays {1} and sacrifices {2} to search their deck and add {3} to their hand',
            player, this, cost, card);
    }

    doneSelecting(player, cost) {
        this.game.addMessage('{0} plays {1} and sacrifices {2} to search their deck, but does not add any card to their hand',
            player, this, cost);
    }
}

SacrificeToTheRedGod.code = '08088';

module.exports = SacrificeToTheRedGod;
