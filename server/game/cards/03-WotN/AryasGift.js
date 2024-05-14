const DrawCard = require('../../drawcard.js');

class AryasGift extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move attachment',
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.parent &&
                    card.parent.isFaction('stark') &&
                    card.parent.getType() === 'character' &&
                    card.parent.controller === this.controller
            },
            handler: (context) => {
                let attachment = context.target;
                let oldParent = attachment.parent;

                this.game.promptForSelect(context.player, {
                    cardCondition: (card) =>
                        card.getType() === 'character' &&
                        card.controller === context.player &&
                        card !== oldParent &&
                        attachment.controller.canAttach(attachment, card) &&
                        card.location === 'play area',
                    onSelect: (player, card) =>
                        this.moveAttachment(player, card, attachment, oldParent)
                });
            }
        });
    }

    moveAttachment(player, newParent, attachment, oldParent) {
        player.attach(attachment.controller, attachment, newParent);
        this.game.addMessage(
            '{0} plays {1} to move {2} from {3} to {4}',
            player,
            this,
            attachment,
            oldParent,
            newParent
        );
        return true;
    }
}

AryasGift.code = '03024';

module.exports = AryasGift;
