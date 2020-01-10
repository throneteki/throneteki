const DrawCard = require('../../drawcard');

class SerDavosSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeKilled()
        });
    }
}

SerDavosSeaworth.code = '16001';

module.exports = SerDavosSeaworth;
