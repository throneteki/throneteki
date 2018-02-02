const DrawCard = require('../../drawcard.js');

class BlackWalder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.attackingPlayer === this.controller &&
                this.game.currentChallenge.number === 3),
            match: this,
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.dynamicStrength(() => this.tokens['gold'] * 2)
            ]
        });
    }
}

BlackWalder.code = '06037';

module.exports = BlackWalder;
