const DrawCard = require('../../drawcard.js');

class RaidingKhalasar extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.isAttacking(this) &&
                this.bloodriderIsAttacking(),
            match: card => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }

    bloodriderIsAttacking() {
        return this.game.currentChallenge &&
            this.game.currentChallenge.getParticipants().some(card =>
                card.controller === this.controller &&
                this.game.currentChallenge.isAttacking(card) &&
                card.hasTrait('Bloodrider'));
    }
}

RaidingKhalasar.code = '08113';

module.exports = RaidingKhalasar;
