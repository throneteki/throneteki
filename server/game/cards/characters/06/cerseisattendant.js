const DrawCard = require('../../../drawcard.js');

class CerseisAttendant extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.opponentHasNoCardsInHand(),
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
    }

    opponentHasNoCardsInHand() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return opponent && opponent.hand.size() === 0;
    }
}

CerseisAttendant.code = '06049';

module.exports = CerseisAttendant;
