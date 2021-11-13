const DrawCard = require('../../drawcard');

class HarmaDogshead extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) => event.isPillage && event.source.controller === context.player && event.source.hasTrait('Wildling')
            },
            limit: ability.limit.perPhase(2),
            handler: context => {
                this.game.promptForDeckSearch(context.player, {
                    numCards: 10,
                    activePromptTitle: 'Select an attachment',
                    cardCondition: card => 
                        card.getType() === 'attachment' &&
                        card.getPrintedCost() <= 2 &&
                        (card.hasTrait('Weapon') || card.hasTrait('Item')) &&
                        this.canAttachToEligibleTarget(context.player, card) &&
                        this.controller.canPutIntoPlay(card),
                    onSelect: (player, card) => this.cardSelected(context, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    canAttachToEligibleTarget(player, attachment) {
        return this.game.anyCardsInPlay(card => player.canAttach(attachment, card));
    }

    cardSelected(context, attachment) {
        this.game.addMessage('{0} uses {1} to search their deck and finds {2}',
            context.player, this, attachment);
        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Select target for attachment',
            cardCondition: card => context.player.canAttach(attachment, card),
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
        this.game.addMessage('{0} uses {1} to search their deck, but does not put any card into play',
            player, this);
    }
}

HarmaDogshead.code = '21025';

module.exports = HarmaDogshead;
