const PlotCard = require('../../plotcard.js');

class GrandMelee extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge,
            match: card => this.game.currentChallenge.isParticipating(card) && this.isParticipatingAlone(card),
            targetController: 'any',
            effect: ability.effects.doesNotContributeStrength()
        });
    }

    isParticipatingAlone(card) {
        if(this.game.currentChallenge.isAttacking(card)) {
            return this.game.currentChallenge.attackers.length === 1;
        }
        return this.game.currentChallenge.defenders.length === 1;
    }
}

GrandMelee.code = '10051';

module.exports = GrandMelee;
