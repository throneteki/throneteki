import PlotCard from '../../plotcard.js';
import GameActions from '../../GameActions/index.js';

class AClashOfKings extends PlotCard {
    // A Clash of Kings (01001)
    // Reaction: After you win a [power] challenge, move 1 power from the losing opponent's faction
    // card to your own.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.loser.faction.power > 0
            },
            message: {
                format: "{winner} uses {source} to move 1 power from {loser}'s faction card to their own",
                args: {
                    winner: (context) => context.game.currentChallenge.winner,
                    loser: (context) => context.game.currentChallenge.loser
                }
            },
            gameAction: GameActions.movePower((context) => ({
                from: context.game.currentChallenge.loser.faction,
                to: context.game.currentChallenge.winner.faction,
                amount: 1
            }))
        });
    }
}

AClashOfKings.code = '01001';

export default AClashOfKings;
