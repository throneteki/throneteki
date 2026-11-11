import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class NaggasRibs extends DrawCard {
    // Nagga's Ribs (08013)
    // For each character in your dead pile, Nagga's Ribs contributes 2 STR to your total for
    // dominance.
    // Reaction: After a character is placed in your discard pile, move it to your dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.dynamicDominanceStrength(
                (card) => 2 * card.controller.deadPile.length
            )
        });

        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.location === 'discard pile' &&
                    event.card.owner === context.player
            },
            message: {
                format: '{player} uses {source} to move {card} to their dead pile',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.placeCard((context) => ({
                card: context.event.card,
                location: 'dead pile'
            }))
        });
    }
}

NaggasRibs.code = '08013';

export default NaggasRibs;
