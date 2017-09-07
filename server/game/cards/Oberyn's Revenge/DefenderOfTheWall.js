const DrawCard = require('../../drawcard.js');

class DefenderOfTheWall extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isDefending(this),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

DefenderOfTheWall.code = '06085';

module.exports = DefenderOfTheWall;
