const DrawCard = require('../../../drawcard.js');

class CastleBlackMason extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 10 cards for location or attachment',
            cost: ability.costs.kneelMultiple(2, card => card.getType() === 'character' && card.hasTrait('Builder')),
            limit: ability.limit.perRound(2),
            handler: context => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card to add to your hand',
                    cardType: ['attachment', 'location'],
                    onSelect: (player, card) => this.cardSelected(player, card, context.kneelingCostCards),
                    onCancel: player => this.doneSelecting(player, context.kneelingCostCards),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, kneeledCards) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to kneel {2}, search their deck, and add {3} to their hand',
                             player, this, kneeledCards, card);
    }

    doneSelecting(player, kneeledCards) {
        this.game.addMessage('{0} uses {1} to kneel {2} and search their deck, but does not add any card to their hand',
                             player, this, kneeledCards);
    }
}

CastleBlackMason.code = '07009';

module.exports = CastleBlackMason;
