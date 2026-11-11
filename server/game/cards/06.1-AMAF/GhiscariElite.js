import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function eventOrAttachmentInDiscard(source, card) {
    return (
        card.controller === source.controller &&
        card.location === 'discard pile' &&
        ['event', 'attachment'].includes(card.getType())
    );
}

class GhiscariElite extends DrawCard {
    // Ghiscari Elite (06013)
    // Reaction: After Ghiscari Elite is knelt, choose an attachment or event in your discard pile,
    // and place it on the bottom of your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardKneeled: (event, context) =>
                    event.card === context.source &&
                    context.source.controller.discardPile.some((c) =>
                        eventOrAttachmentInDiscard(context.source, c)
                    )
            },
            target: {
                activePromptTitle: 'Select attachment or event',
                cardCondition: (card, context) => eventOrAttachmentInDiscard(context.source, card)
            },
            message: '{player} uses {source} to place {target} on the bottom of their deck',
            gameAction: GameActions.returnCardToDeck((context) => ({
                card: context.target,
                bottom: true
            }))
        });
    }
}

GhiscariElite.code = '06013';

export default GhiscariElite;
