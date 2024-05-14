const DrawCard = require('../../drawcard.js');

class Doreah extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasParticipatingLordOrLady(),
            match: this,
            effect: ability.effects.addKeyword('Insight')
        });
    }

    hasParticipatingLordOrLady() {
        let challenge = this.game.currentChallenge;
        if (!challenge) {
            return false;
        }

        let ourCards =
            challenge.attackingPlayer === this.controller
                ? challenge.attackers
                : challenge.defenders;
        return ourCards.some((card) => card.hasTrait('Lord') || card.hasTrait('Lady'));
    }
}

Doreah.code = '04033';

module.exports = Doreah;
