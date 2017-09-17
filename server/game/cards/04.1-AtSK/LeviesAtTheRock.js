const DrawCard = require('../../drawcard.js');

class LeviesAtTheRock extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => (
                    event.challenge.defendingPlayer === this.controller &&
                    event.challenge.attackingPlayer.gold >= 1
                )
            },
            handler: context => {
                let challenge = context.event.challenge;
                let opponent = challenge.attackingPlayer;
                let gold = Math.min(opponent.gold, challenge.attackers.length);
                this.game.addGold(opponent, -gold);
                this.game.addGold(this.controller, gold);
                this.game.addMessage('{0} plays {1} to move {2} gold from {3}\'s gold pool to their own',
                    this.controller, this, gold, opponent);
            }
        });
    }
}

LeviesAtTheRock.code = '04011';

module.exports = LeviesAtTheRock;
