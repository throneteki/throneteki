import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SorrowfulMan extends DrawCard {
    // Sorrowful Man (26033)
    // Shadow (2).
    // Reaction: After Sorrowful Man comes out of shadows, switch a character in an opponent's
    // discard pile with a character in that player's dead pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card === context.source &&
                    // Both characters must belong to the same opponent, which the targets cannot
                    // check on their own
                    context.game
                        .getOpponents(context.player)
                        .some((player) => hasCharacterInBothPiles(player))
            },
            targets: {
                discardCard: {
                    activePromptTitle: 'Select a character in a discard pile',
                    cardCondition: (card, context) =>
                        card.location === 'discard pile' &&
                        card.getType() === 'character' &&
                        card.controller !== context.player &&
                        hasCharacterInBothPiles(card.controller)
                },
                deadCard: {
                    activePromptTitle: 'Select a character in a dead pile',
                    cardCondition: (card, context) =>
                        card.location === 'dead pile' &&
                        card.getType() === 'character' &&
                        card.controller !== context.player &&
                        (!context.targets.discardCard ||
                            card.controller === context.targets.discardCard.controller)
                }
            },
            message: {
                format: "{player} uses {source} to switch {discardCard} in {controller}'s discard pile with {deadCard} in their dead pile",
                args: {
                    discardCard: (context) => context.targets.discardCard,
                    deadCard: (context) => context.targets.deadCard,
                    controller: (context) => context.targets.discardCard.controller
                }
            },
            gameAction: GameActions.switch((context) => ({
                cards: [context.targets.discardCard, context.targets.deadCard]
            }))
        });
    }
}

function hasCharacterInBothPiles(player) {
    return (
        player.discardPile.some((card) => card.getType() === 'character') &&
        player.deadPile.some((card) => card.getType() === 'character')
    );
}

SorrowfulMan.code = '26033';

export default SorrowfulMan;
