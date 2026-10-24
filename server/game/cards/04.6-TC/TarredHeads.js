import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TarredHeads extends DrawCard {
    // Tarred Heads (04119)
    // Reaction: After you win a [power] challenge, discard 1 card at random from the losing
    // opponent's hand. If that card is a character, place it in its owner's dead pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === context.player
            },
            message: {
                format: "{player} plays {source} to discard a card at random from {loser}'s hand",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                amount: 1,
                player: context.event.challenge.loser,
                discardEvent: (card) =>
                    GameActions.discardCard({
                        card,
                        allowSave: false,
                        destination: card.getType() === 'character' ? 'dead pile' : 'discard pile'
                    }).createEvent(context)
            }))
        });
    }
}

TarredHeads.code = '04119';

export default TarredHeads;
