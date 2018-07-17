const DrawCard = require('../../drawcard.js');

class BlackWalder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ attackingPlayer: this.controller, number: 3 }),
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
