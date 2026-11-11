import DrawCard from '../../drawcard.js';

class CrowKillers extends DrawCard {
    // Crow Killers (07041)
    // Crow Killers does not kneel when declared as an attacker against an opponent whose reserve
    // value is higher than yours.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.opponentHasHigherReserve(),
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
            this.controller.getReserve() < challenge.defendingPlayer.getReserve()
        );
    }
}

CrowKillers.code = '07041';

export default CrowKillers;
