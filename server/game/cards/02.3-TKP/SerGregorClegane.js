import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerGregorClegane extends DrawCard {
    // Ser Gregor Clegane (02049)
    // Pillage. Renown.
    // Reaction: After Ser Gregor Clegane discards a character using pillage, place that card in its
    // owner's dead pile. Then, you may choose and kill a character with printed cost equal to that
    // card's printed cost.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage &&
                    event.source === context.source &&
                    event.card.getType() === 'character' &&
                    event.card.location === 'discard pile'
            },
            message: {
                format: "{player} uses {source} to place {discarded} in {owner}'s dead pile",
                args: {
                    discarded: (context) => context.event.card,
                    owner: (context) => context.event.card.owner
                }
            },
            gameAction: GameActions.placeCard((context) => ({
                card: context.event.card,
                location: 'dead pile'
            })).then({
                condition: (context) =>
                    context.game.anyCardsInPlay((card) =>
                        sameCost(card, context.parentContext.event.card)
                    ),
                target: {
                    optional: true,
                    cardCondition: (card, context) =>
                        card.location === 'play area' &&
                        sameCost(card, context.parentContext.event.card),
                    gameAction: 'kill'
                },
                message: 'Then {player} uses {source} to kill {target}',
                gameAction: GameActions.kill((context) => ({ card: context.target }))
            })
        });
    }
}

function sameCost(card, discarded) {
    return card.getType() === 'character' && card.getPrintedCost() === discarded.getPrintedCost();
}

SerGregorClegane.code = '02049';

export default SerGregorClegane;
