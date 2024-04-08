const DrawCard = require('../../drawcard.js');

class GhiscariElite extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: event => (
                    event.card === this &&
                    this.controller.discardPile.some(c => this.eventOrAttachmentInDiscard(c))
                )
            },
            target: {
                activePromptTitle: 'Select attachment or event',
                cardCondition: card => this.eventOrAttachmentInDiscard(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to place {2} on the bottom of their deck', this.controller, this, context.target);
                this.controller.moveCard(context.target, 'draw deck', { bottom: true });
            }
        });
    }

    eventOrAttachmentInDiscard(card) {
        return (
            card.controller === this.controller &&
            card.location === 'discard pile' &&
            ['event', 'attachment'].includes(card.getType())
        );
    }
}

GhiscariElite.code = '06013';

module.exports = GhiscariElite;
