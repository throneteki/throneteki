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
                    potentialAction: (context) => {
                        let message = this.kneeled
                            ? "discard a card at random from {winner}'s hand"
                            : 'have {winner} choose and discard a card from their hand';
                        return Message.fragment(message, {
                            winner: context.event.challenge.winner
                        });
                    }
                }
            },
            gameAction: GameActions.ifCondition({
                condition: () => this.kneeled,
                thenAction: GameActions.discardAtRandom((context) => ({
                    player: context.event.challenge.winner
                })),
                elseAction: GameActions.genericHandler((context) => {
                    this.game.promptForSelect(context.event.challenge.winner, {
                        activePromptTitle: 'Select a card',
                        source: this,
                        cardCondition: (card) =>
                            card.location === 'hand' &&
                            card.controller === context.event.challenge.winner,
                        onSelect: (player, card) => this.onCardSelected(context, player, card)
                    });
                })
            })
        });
    }

    onCardSelected(context, player, card) {
        this.game.addMessage('{0} chooses to discard {1} from their hand', card.controller, card);
        this.game.resolveGameAction(GameActions.discardCard({ card, source: this }), context);
        return true;
    }
}

TheBloodyGate.code = '23033';

export default TheBloodyGate;
