const DrawCard = require('../../../drawcard.js');

class SuperiorClaim extends DrawCard {
    canPlay(player, cardId) {
        if(player !== this.owner || this.uuid !== cardId) {
            return false;
        }

        if(!this.game.currentChallenge || this.game.currentChallenge.winner !== this.owner || this.game.currentChallenge.strengthDifference < 5) {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.owner !== player) {
            return;
        }

        this.game.addPower(player, 2);
        this.game.addMessage('{0} uses {1} to gain to power for their faction', player, this);
    }
}

SuperiorClaim.code = '01043';

module.exports = SuperiorClaim;
