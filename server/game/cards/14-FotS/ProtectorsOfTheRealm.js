import DrawCard from '../../drawcard.js';

class ProtectorsOfTheRealm extends DrawCard {
    // Protectors of the Realm (14031)
    // No attachments.
    // X is your reserve value.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength((card, context) => context.source.getSTR())
        });
    }

    getSTR() {
        return this.controller.getReserve();
    }
}

ProtectorsOfTheRealm.code = '14031';

export default ProtectorsOfTheRealm;
