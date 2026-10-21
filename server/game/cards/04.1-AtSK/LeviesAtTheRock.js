import DrawCard from '../../drawcard.js';

class LeviesAtTheRock extends DrawCard {
    // Levies at the Rock (04011)
    // Reaction: After a player initiates a challenge against you, move up to X gold from that
    // player's gold pool to your own. X is the number of attacking characters.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedAgainstPlayer === this.controller &&
                    event.challenge.attackingPlayer.gold >= 1
            },
            handler: (context) => {
                let challenge = context.event.challenge;
                let opponent = challenge.attackingPlayer;
                let gold = Math.min(opponent.gold, challenge.attackers.length);
                this.game.transferGold({ from: opponent, to: this.controller, amount: gold });
                this.game.addMessage(
                    "{0} plays {1} to move {2} gold from {3}'s gold pool to their own",
                    this.controller,
                    this,
                    gold,
                    opponent
                );
            }
        });
    }
}

LeviesAtTheRock.code = '04011';

export default LeviesAtTheRock;
