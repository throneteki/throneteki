import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import Message from '../../Message.js';

class TheBloodyGate extends DrawCard {
    // The Bloody Gate (23033)
    // Reaction: After you lose a [military] challenge in which you control a defending character,
    // the winning opponent must choose and discard 1 card from their hand. (Discard 1 card at
    // random from their hand instead if The Bloody Gate is kneeling.)
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({
                        defendingPlayer: context.player,
                        loser: context.player,
                        challengeType: 'military',
                        match: (challenge) =>
                            challenge.defenders.some(
                                (card) => card.controller === context.player
                            ) && challenge.winner.hand.length > 0
                    })
            },
            message: {
                format: '{player} uses {source} to {potentialAction}',
                args: {
                    potentialAction: (context) =>
                        Message.fragment(
                            context.source.kneeled
                                ? "discard a card at random from {winner}'s hand"
                                : 'have {winner} choose and discard a card from their hand',
                            { winner: context.event.challenge.winner }
                        )
                }
            },
            gameAction: GameActions.ifCondition({
                condition: (context) => context.source.kneeled,
                thenAction: GameActions.discardAtRandom((context) => ({
                    player: context.event.challenge.winner
                })),
                elseAction: GameActions.chooseCards({
                    player: (context) => context.event.challenge.winner,
                    title: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'hand' && card.controller === context.choosingPlayer,
                    gameAction: (card, context) =>
                        GameActions.discardCard({ card, source: context.source })
                })
            })
        });
    }
}

TheBloodyGate.code = '23033';

export default TheBloodyGate;
