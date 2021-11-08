const DrawCard = require('../../drawcard.js');

class ValyrianSteelArmor extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.noOtherBigNonArmy(),
            effect: [
                ability.effects.cannotBeKilled(),
                ability.effects.cannotBeDiscarded()
            ]
        });
        this.whileAttached({
            match: card => card.name === 'Euron Crow\'s Eye',
            effect: ability.effects.addKeyword('insight')
        });
    }
    
    noOtherBigNonArmy() {
        return !this.controller.anyCardsInPlay(card => (
            card !== this.parent &&
            !card.hasTrait('Army') &&
            card.getPrintedCost() >= 6
        ));
    }
}

ValyrianSteelArmor.code = '21006';

module.exports = ValyrianSteelArmor;
