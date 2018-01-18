const DrawCard = require('../../drawcard.js');

class AryasGift extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move attachment',
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: card => card.getType && card.getType() === 'attachment' && card.parent &&
                    card.parent.isFaction('stark') && card.parent.controller === this.controller
            },
            handler: context => {
                let attachment = context.target;
                let oldOwner = attachment.parent;

                this.game.promptForSelect(this.controller, {
                    cardCondition: card => card.getType() === 'character' && card.controller === this.controller &&
                        card !== oldOwner && this.controller.canAttach(attachment, card) && card.location === 'play area',
                    onSelect: (player, card) => this.moveAttachment(player, card, attachment, oldOwner)
                });

            }
        });
    }

    moveAttachment(player, newOwner, attachment, oldOwner) {
        player.attach(player, attachment, newOwner);
        this.game.addMessage('{0} moves {1} from {2} to {3}', player, attachment, oldOwner, newOwner);

        return true;
    }
}

AryasGift.code = '03024';

module.exports = AryasGift;
