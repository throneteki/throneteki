const DrawCard = require('../../drawcard');

class GiftsForTheWidow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for attachment',
            cost: [
                ability.costs.kneelFactionCard(),
                ability.costs.payXGold(() => 0, () => 99)
            ],
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    activePromptTitle: 'Select an attachment',
                    cardCondition: card => card.getType() === 'attachment' && card.hasPrintedCost() && card.getPrintedCost() <= context.xValue && this.canAttachToControlledCharacter(context.player, card),
                    onSelect: (player, card) => this.cardSelected(context, card),
                    onCancel: () => this.doneSelecting(context),
                    source: this
                });
            }
        });
    }

    canAttachToControlledCharacter(player, attachment) {
        return player.anyCardsInPlay(card => card.getType() === 'character' && player.canAttach(attachment, card));
    }

    cardSelected(context, attachment) {
        this.game.addMessage('{0} plays {1}, kneels their faction card and pays {2} gold to search their deck and finds {3}', context.player, this, context.xValue, attachment);
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

    doneSelecting(context) {
        this.game.addMessage('{0} plays {1}, kneels their faction card and pays {2} gold to search their deck but does not find a card', context.player, this, context.xValue);
    }
}

GiftsForTheWidow.code = '17135';

module.exports = GiftsForTheWidow;
