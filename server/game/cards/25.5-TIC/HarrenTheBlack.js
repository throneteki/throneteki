import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class HarrenTheBlack extends DrawCard {
    // Harren the Black (25084)
    // Unique [greyjoy] location you control only.
    // Each opponent cannot marshal copies of locations that are in their discard pile.
    // Forced Reaction: After a character you control discards a card using pillage, discard the top
    // card of each player's deck.
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'greyjoy',
            controller: 'current',
            unique: true
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.cannotMarshal(
                (card) => card.getType() === 'location' && hasCopyInDiscard(card)
            )
        });
        this.forcedReaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage && event.source.controller === context.player
            },
            message: '{player} is forced by {source} to discard the top card of each players deck',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getPlayersInFirstPlayerOrder()
                    .map((player) =>
                        GameActions.discardTopCards({ player, amount: 1, source: context.source })
                    )
            )
        });
    }
}

function hasCopyInDiscard(card) {
    return card.controller.discardPile.some(
        (discardedCard) => card !== discardedCard && card.isCopyOf(discardedCard)
    );
}

HarrenTheBlack.code = '25084';

export default HarrenTheBlack;
