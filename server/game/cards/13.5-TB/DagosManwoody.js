const DrawCard = require('../../drawcard');

class DagosManwoody extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.numOfTraitsInUsedPile() >= 5,
            match: this,
            effect: [ability.effects.addKeyword('Stealth'), ability.effects.addKeyword('Renown')]
        });
    }

    numOfTraitsInUsedPile() {
        const uniqueTraits = this.controller.getTraitsOfUsedPlots();
        return uniqueTraits.size;
    }
}

DagosManwoody.code = '13095';

module.exports = DagosManwoody;
