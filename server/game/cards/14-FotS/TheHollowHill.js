const DrawCard = require('../../drawcard');

class TheHollowHill extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search your deck',
            phase: 'dominance',
            condition: () => !this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.isLoyal()),
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {costs.kneel} to search the top 10 cards of their deck for a non-loyal character',
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && !card.isLoyal(),
                    onSelect: (player, card, valid) => this.cardSelected(player, card, valid),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card, valid) {
        if(valid) {
            this.game.addMessage('{0} adds {1} to their hand',
                player, card);
            player.moveCard(card, 'hand');
        }
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not add any card to their hand',
            player);
    }
}

TheHollowHill.code = '14042';

module.exports = TheHollowHill;
