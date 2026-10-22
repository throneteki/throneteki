import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LeviesAtTheRock extends DrawCard {
    // Levies at the Rock (04011)
    // Reaction: After a player initiates a challenge against you, move up to X gold from that
    // player's gold pool to your own. X is the number of attacking characters.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.player
            },
            message: {
                format: "{player} plays {source} to move up to {amount} gold from {opponent}'s gold pool to their own",
                args: {
                    amount: (context) => context.event.challenge.attackers.length,
                    opponent: (context) => context.event.challenge.attackingPlayer
                }
            },
            gameAction: GameActions.transferGold((context) => ({
                from: context.event.challenge.attackingPlayer,
                to: context.player,
                amount: context.event.challenge.attackers.length
            }))
        });
    }
}

LeviesAtTheRock.code = '04011';

export default LeviesAtTheRock;
