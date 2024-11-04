import DrawCard from '../../drawcard.js';

class ProtectorsOfTheRealm extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.getSTR())
        });
    }

    getSTR() {
        return this.controller.getReserve();
    }
}

ProtectorsOfTheRealm.code = '14031';

export default ProtectorsOfTheRealm;
