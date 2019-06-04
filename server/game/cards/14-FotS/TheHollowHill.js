const DrawCard = require('../../drawcard');

class TheHollowHill extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search your deck',
            phase: 'dominance',
            condition: () => !this.controller.anyCardsInPlay(card => card.getType() === 'character' && card.isLoyal()),
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select a character',
                    cardCondition: card => card.getType() === 'character' && !card.isLoyal(),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        this.game.addMessage('{0} kneels {1} to search their deck and add {2} to their hand',
            player, this, card);
        player.moveCard(card, 'hand');
    }

    doneSelecting(player) {
        this.game.addMessage('{0} kneels {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

TheHollowHill.code = '14042';

module.exports = TheHollowHill;
