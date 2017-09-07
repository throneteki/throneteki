const DrawCard = require('../../../drawcard.js');

class LeviesAtTheRock extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.defendingPlayer === this.controller && this.opponentHasGold()
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                let gold = Math.min(opponent.gold, this.game.currentChallenge.attackers.length);
                this.game.addGold(opponent, -gold);
                this.game.addGold(this.controller, gold);
                this.game.addMessage('{0} plays {1} to move {2} gold from {3}\'s gold pool to their own', 
                    this.controller, this, gold, opponent);
            }
        });
    }

    opponentHasGold() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return opponent && opponent.gold >= 1;
    }
}

LeviesAtTheRock.code = '04011';

module.exports = LeviesAtTheRock;
