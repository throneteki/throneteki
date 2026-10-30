import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class Yunkai extends DrawCard {
    // Yunkai (08074)
    // Bestow (4).
    // Action: During a challenge in which you are the attacking player, kneel Yunkai and discard X
    // gold from it to remove each character with STR X or lower from the challenge (X cannot be 0).
    // Then, if you win the challenge, place 2 gold from the treasury on Yunkai.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove characters from challenge',
            condition: (context) =>
                context.game.currentChallenge &&
                context.game.currentChallenge.attackingPlayer === context.player &&
                context.game.currentChallenge.getNumberOfParticipants() > 0,
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardXGold(
                    (context) => Math.max(Math.min(...participatingStrengths(context)), 1),
                    (context) => Math.max(Math.max(...participatingStrengths(context)), 1)
                )
            ],
            message: {
                format: '{player} kneels and discards {amount} gold from {source} to remove all characters with STR {amount} or lower from the challenge',
                args: { amount: (context) => context.xValue }
            },
            gameAction: GameActions.simultaneously([
                GameActions.simultaneously((context) =>
                    context.game
                        .filterCardsInPlay(
                            (card) => card.isParticipating() && card.getStrength() <= context.xValue
                        )
                        .map((card) => GameActions.removeFromChallenge({ card }))
                ),
                GameActions.delayedEffect({
                    duration: 'untilEndOfChallenge',
                    when: {
                        afterChallenge: (event, context) =>
                            event.challenge.winner === context.player
                    },
                    message: '{player} places 2 gold tokens from the treasury on {source}',
                    gameAction: GameActions.placeToken((context) => ({
                        card: context.source,
                        token: Tokens.gold,
                        amount: 2
                    }))
                })
            ])
        });
    }
}

function participatingStrengths(context) {
    return context.game
        .filterCardsInPlay((card) => card.isParticipating())
        .map((card) => card.getStrength());
}

Yunkai.code = '08074';

export default Yunkai;
