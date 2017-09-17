const DrawCard = require('../../drawcard.js');

class DisputedClaim extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.hasMostFactionPower(),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('Renown')
            ]
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !(card.hasTrait('Bastard') || card.hasTrait('Lord') || card.hasTrait('Lady'))) {
            return false;
        }
        return super.canAttach(player, card);
    }

    hasMostFactionPower() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.every(opponent => this.controller.faction.power > opponent.faction.power);
    }
}

DisputedClaim.code = '05026';

module.exports = DisputedClaim;
