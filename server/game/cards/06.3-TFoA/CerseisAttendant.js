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
        if (!challenge) {
            return false;
        }

        return (
            (this.isAttacking() && challenge.defendingPlayer.hand.length === 0) ||
            (this.isDefending() && challenge.attackingPlayer.hand.length === 0)
        );
    }
}

CerseisAttendant.code = '06049';

module.exports = CerseisAttendant;
