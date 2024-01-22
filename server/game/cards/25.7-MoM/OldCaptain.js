const DrawCard = require('../../drawcard.js');

class OldCaptain extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !this.kneeled,
            match: this,
            effect: [
                ability.effects.addKeyword('pillage'),
                ability.effects.addKeyword('renown')
            ]
        });
    }
}

OldCaptain.code = '25519';
OldCaptain.version = '1.1';

module.exports = OldCaptain;
