import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TarredHeads extends DrawCard {
    // Tarred Heads (04119)
    // Reaction: After you win a [power] challenge, discard 1 card at random from the losing
    // opponent's hand. If that card is a character, place it in its owner's dead pile.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'power' &&
                    event.challenge.winner === this.controller &&
                    event.challenge.loser.hand.length >= 1
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                amount: 1,
                player: context.event.challenge.loser,
                discardEvent: (card) => {
                    const event = GameActions.discardCard({ card, allowSave: false }).createEvent();
                    let deadMessage = '';

                    if (card.getType() === 'character') {
                        deadMessage = ' and place it in the dead pile';
                        event.replaceHandler(() => {
                            event.thenAttachEvent(
                                GameActions.placeCard({
                                    card: event.card,
                                    location: 'dead pile'
                                }).createEvent()
                            );
                        });
                    }

                    this.game.addMessage(
                        "{0} plays {1} to discard {2} from {3}'s hand{4}",
                        context.player,
                        context.source,
                        card,
                        context.event.challenge.loser,
                        deadMessage
                    );

                    return event;
                }
            }))
        });
    }
}

TarredHeads.code = '04119';

export default TarredHeads;
