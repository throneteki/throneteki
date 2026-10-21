import DrawCard from '../../drawcard.js';

class GhiscariElite extends DrawCard {
    // Ghiscari Elite (06013)
    // Reaction: After Ghiscari Elite is knelt, choose an attachment or event in your discard pile,
    // and place it on the bottom of your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event) =>
                    event.card === this &&
                    this.controller.discardPile.some((c) => this.eventOrAttachmentInDiscard(c))
            },
            target: {
                activePromptTitle: 'Select attachment or event',
                cardCondition: (card) => this.eventOrAttachmentInDiscard(card)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to place {2} on the bottom of their deck',
                    this.controller,
                    this,
                    context.target
                );
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

export default GhiscariElite;
