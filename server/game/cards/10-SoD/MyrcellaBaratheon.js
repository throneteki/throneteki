import DrawCard from '../../drawcard.js';

class MyrcellaBaratheon extends DrawCard {
    // Myrcella Baratheon (10029)
    // Myrcella Baratheon does not kneel when declared as an attacker against an opponent with fewer
    // cards in his or her hand than you.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.opponentHoldsLessCards(),
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    opponentHoldsLessCards() {
        let challenge = this.game.currentChallenge;

        if (!challenge) {
            return false;
        }

        return (
            challenge.attackingPlayer === this.controller &&
            this.controller.getHandCount() > challenge.defendingPlayer.getHandCount()
        );
    }
}

MyrcellaBaratheon.code = '10029';

export default MyrcellaBaratheon;
