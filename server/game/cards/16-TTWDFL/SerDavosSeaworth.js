import DrawCard from '../../drawcard.js';

class SerDavosSeaworth extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeKilled()
        });
    }
}

SerDavosSeaworth.code = '16001';

export default SerDavosSeaworth;
