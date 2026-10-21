import DrawCard from '../../drawcard.js';

class SerDavosSeaworth extends DrawCard {
    // Ser Davos Seaworth (16001)
    // Ser Davos Seaworth cannot be killed.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeKilled()
        });
    }
}

SerDavosSeaworth.code = '16001';

export default SerDavosSeaworth;
