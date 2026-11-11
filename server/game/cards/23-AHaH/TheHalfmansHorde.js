import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function getNumberToDiscard(source, player) {
    return player.getNumberOfCardsInPlay(
        (card) =>
            card !== source &&
            card.isUnique() &&
            card.isAttacking() &&
            card.hasTrait('Clansman') &&
            card.getType() === 'character'
    );
}

class TheHalfmansHorde extends DrawCard {
    // The Halfman's Horde (23005)
    // Assault. Intimidate. No attachments.
    // Reaction: After you win a challenge in which The Halfman's Horde is attacking, discard 1 card
    // at random from the losing opponent's hand for each other unique attacking Clansman character.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isAttacking()
            },
            message: {
                format: "{player} uses {source} to discard {number} cards at random from {loser}'s hand",
                args: {
                    number: (context) =>
                        getNumberToDiscard(context.source, context.event.challenge.winner),
                    loser: (context) => context.event.challenge.loser
                }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.event.challenge.loser,
                amount: getNumberToDiscard(context.source, context.event.challenge.winner)
            }))
        });
    }
}

TheHalfmansHorde.code = '23005';

export default TheHalfmansHorde;
