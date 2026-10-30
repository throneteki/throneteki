import DrawCard from '../../drawcard.js';

class CerseisAttendant extends DrawCard {
    // Cersei's Attendant (06049)
    // While Cersei's Attendant is participating in a challenge against an opponent with no cards in
    // his or her hand, Cersei's Attendant gains insight.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.opponentHasNoCardsInHand(),
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
            (this.isAttacking() && challenge.defendingPlayer.getHandCount() === 0) ||
            (this.isDefending() && challenge.attackingPlayer.getHandCount() === 0)
        );
    }
}

CerseisAttendant.code = '06049';

export default CerseisAttendant;
