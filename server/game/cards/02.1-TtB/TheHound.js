import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheHound extends DrawCard {
    // The Hound (02009)
    // Ambush (4).
    // Forced Reaction: After you win a challenge in which The Hound is participating, you may
    // discard 1 card at random from your hand. If you do not, return The Hound to your hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    event.challenge.isParticipating(context.source)
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.player.hand.length > 0,
                thenAction: GameActions.choose({
                    title: (context) => `Discard 1 card at random for ${context.source.name}?`,
                    choices: {
                        Yes: {
                            message:
                                '{player} is forced to discard a card to keep {source} in play',
                            gameAction: GameActions.discardAtRandom((context) => ({
                                player: context.player,
                                amount: 1
                            }))
                        },
                        No: returnToHand()
                    }
                }),
                elseAction: returnToHand()
            })
        });
    }
}

function returnToHand() {
    return {
        message: '{player} is forced to return {source} to their hand',
        gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
    };
}

TheHound.code = '02009';

export default TheHound;
