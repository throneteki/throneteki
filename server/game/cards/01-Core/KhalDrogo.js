const DrawCard = require('../../drawcard.js');

class KhalDrogo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.mayInitiateAdditionalChallenge('military')
        });
    }
}

KhalDrogo.code = '01162';

module.exports = KhalDrogo;
