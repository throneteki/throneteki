const DrawCard = require('../../drawcard.js');

class CrowKillers extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.opponentHasHigherReserve(),
            match: this,
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    opponentHasHigherReserve() {
        let challenge = this.game.currentChallenge;

        if (!challenge) {
            return false;
        }

        return (
            challenge.attackingPlayer === this.controller &&
            this.controller.getTotalReserve() < challenge.defendingPlayer.getTotalReserve()
        );
    }
}

CrowKillers.code = '07041';

module.exports = CrowKillers;
