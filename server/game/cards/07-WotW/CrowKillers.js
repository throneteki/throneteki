import DrawCard from '../../drawcard.js';

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
            this.controller.getReserve() < challenge.defendingPlayer.getReserve()
        );
    }
}

CrowKillers.code = '07041';

export default CrowKillers;
