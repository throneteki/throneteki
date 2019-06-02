const DrawCard = require('../../drawcard');

class ProtectorsOfTheRealm extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });
    }

    getSTR() {
        return this.controller.getTotalReserve();
    }
}

ProtectorsOfTheRealm.code = '14031';

module.exports = ProtectorsOfTheRealm;
