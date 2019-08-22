const DrawCard = require('../../drawcard');
const {flatten} = require('../../../Array');

class DagosManwoody extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.numOfTraitsInUsedPile() >= 5,
            match: this,
            effect: [
                ability.effects.addKeyword('Stealth'),
                ability.effects.addKeyword('Renown')
            ]
        });
    }

    numOfTraitsInUsedPile() {
        const traits = flatten(this.controller.plotDiscard.map(card => card.getTraits()));
        const uniqueTraits = new Set(traits);
        return uniqueTraits.size;
    }
}

DagosManwoody.code = '13095';

module.exports = DagosManwoody;
