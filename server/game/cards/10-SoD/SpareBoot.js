import DrawCard from '../../drawcard.js';

class SpareBoot extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and move attachment',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            target: {
                activePromptTitle: 'Select an attachment',
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'attachment' &&
                    card.parent &&
                    card.parent.controller === this.controller &&
                    (this.allowMoveAttachment(card) || card.kneeled)
            },
            handler: (context) => {
                let attachment = context.target;
                let canMove = this.allowMoveAttachment(attachment);
                let canStand = attachment.kneeled;

                if (canMove) {
                    context.player.attach(attachment.controller, attachment, this);
                }

                if (canStand) {
                    context.player.standCard(attachment);
                }

                let message;

                if (canMove && canStand) {
                    message = '{0} uses {1} to stand {2} and move it to {1}';
                } else if (canMove) {
                    message = '{0} uses {1} to move {2} to {1}';
                } else {
                    message = '{0} uses {1} to stand {2}';
                }

                this.game.addMessage(message, context.player, this, attachment);
            }
        });
    }

    allowMoveAttachment(attachment) {
        return attachment.parent !== this && attachment.controller.canAttach(attachment, this);
    }
}

SpareBoot.code = '10031';

export default SpareBoot;
