const DrawCard = require('../../../drawcard.js');

class RelentlessAssault extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }
        if(!this.game.currentChallenge || this.game.currentChallenge.winner !== this.controller || this.game.currentChallenge.strengthDifference < 5 ||
                this.game.currentChallenge.strengthDifference < 5 && !player.faction.kneeled) {
            return false;
        }
        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }
        var type = this.game.currentChallenge.challengeType;
        player.addChallenge(type, 1);
        this.game.addMessage('{0} uses {1} to gain an additional {2} challenge', player, this, type);
    }
}

RelentlessAssault.code = '04118';

module.exports = RelentlessAssault;
