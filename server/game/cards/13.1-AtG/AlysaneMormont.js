const DrawCard = require('../../drawcard.js');
const Conditions = require('../../Conditions');

class AlysaneMormont extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                Conditions.allCharactersAreStark({ player: this.controller }) &&
                this.game.isDuringChallenge({ challengeType: 'military' }),
            match: this,
            effect: [
                ability.effects.addKeyword('stealth'),
                ability.effects.doesNotKneelAsAttacker()
            ]
        });
    }
}

AlysaneMormont.code = '13001';

module.exports = AlysaneMormont;
