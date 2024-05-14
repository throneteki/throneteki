const DrawCard = require('../../drawcard.js');

class SerJaimeLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: [ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })]
        });
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({ challengeType: 'military' }) &&
                this.isParticipating(),
            match: this,
            effect: [ability.effects.addKeyword('Renown')]
        });
    }
}

SerJaimeLannister.code = '01087';

module.exports = SerJaimeLannister;
