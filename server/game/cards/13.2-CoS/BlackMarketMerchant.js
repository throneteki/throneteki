const DrawCard = require('../../drawcard');

class BlackMarketMerchant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select an attachment',
                    cardCondition: card => card.getType() === 'attachment' && this.canAttachToControlledCharacter(context.player, card),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    canAttachToControlledCharacter(player, attachment) {
        return player.anyCardsInPlay(card => card.getType() === 'character' && player.canAttach(attachment, card));
    }

    cardSelected(player, card) {
        player.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} to search their deck and put {2} into play',
            player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

BlackMarketMerchant.code = '13033';

module.exports = BlackMarketMerchant;
