const DrawCard = require('../../drawcard.js');

class CerseisAttendant extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.opponentHasNoCardsInHand(),
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
    }

    opponentHasNoCardsInHand() {
        let challenge = this.game.currentChallenge;
        if(!challenge) {
            return false;
        }

        return (
            (challenge.isAttacking(this) && challenge.defendingPlayer.hand.size() === 0) ||
            (challenge.isDefending(this) && challenge.attackingPlayer.hand.size() === 0)
        );
    }
}

CerseisAttendant.code = '06049';

module.exports = CerseisAttendant;
