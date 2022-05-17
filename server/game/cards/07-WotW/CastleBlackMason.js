const DrawCard = require('../../drawcard.js');

class CastleBlackMason extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 10 cards for location or attachment',
            cost: ability.costs.kneelMultiple(2, card => card.getType() === 'character' && card.hasTrait('Builder')),
            limit: ability.limit.perRound(2),
            message: '{player} uses {source} and kneels {costs.kneel} to search the top 10 cards of their deck for a location or attachment',
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card',
                    cardType: ['attachment', 'location'],
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} adds {1} to their hand',
            player, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

CastleBlackMason.code = '07009';

module.exports = CastleBlackMason;
