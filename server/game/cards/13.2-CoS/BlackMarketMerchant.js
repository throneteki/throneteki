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
                    onSelect: (player, card) => this.cardSelected(context, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    canAttachToControlledCharacter(player, attachment) {
        return player.anyCardsInPlay(card => card.getType() === 'character' && player.canAttach(attachment, card));
    }

    cardSelected(context, attachment) {
        this.game.addMessage('{0} uses {1} to search their deck and finds {2}',
            context.player, this, attachment);
        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Select target for attachment',
            cardCondition: card => card.getType() === 'character' && card.controller === context.player && context.player.canAttach(attachment, card),
            onSelect: (player, card) => {
                this.game.addMessage('{0} puts {1} into play attached to {2}', context.player, attachment, card);
                context.player.attach(context.player, attachment, card);
                return true;
            },
            onCancel: () => {
                this.game.addAlert('danger', '{0} does not put {1} into play', context.player, attachment);
                return true;
            },
            source: this
        });
    }

    doneSelecting(player) {
        this.game.addMessage('{0} uses {1} to search their deck, but does not add any card to their hand',
            player, this);
    }
}

BlackMarketMerchant.code = '13033';

module.exports = BlackMarketMerchant;
