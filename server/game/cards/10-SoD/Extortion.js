import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Extortion extends DrawCard {
    // Extortion (10030)
    // Reaction: After you win an [intrigue] challenge as the attacking player, gain 3 gold and
    // return up to 3 gold from the losing opponent's gold pool to the treasury.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.attackingPlayer === context.player &&
                    event.challenge.winner === context.player &&
                    event.challenge.challengeType === 'intrigue'
            },
            message: {
                format: "{player} plays {source} to gain 3 gold and return up to 3 gold from {loser}'s gold pool to the treasury",
                args: { loser: (context) => context.event.challenge.loser }
            },
            gameAction: GameActions.simultaneously([
                GameActions.gainGold((context) => ({ player: context.player, amount: 3 })),
                GameActions.returnGoldToTreasury((context) => ({
                    player: context.event.challenge.loser,
                    amount: Math.min(context.event.challenge.loser.gold, 3)
                }))
            ])
        });
    }
}

Extortion.code = '10030';

export default Extortion;
