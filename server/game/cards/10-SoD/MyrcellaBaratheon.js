const DrawCard = require('../../drawcard.js');

class MyrcellaBaratheon extends DrawCard {
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
            this.controller.hand.length > challenge.defendingPlayer.hand.length
        );
    }
}

MyrcellaBaratheon.code = '10029';

module.exports = MyrcellaBaratheon;
