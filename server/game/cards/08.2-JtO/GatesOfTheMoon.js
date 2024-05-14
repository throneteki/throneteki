const DrawCard = require('../../drawcard.js');

class GatesOfTheMoon extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 2
        });

        this.persistentEffect({
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyGold(1)
        });
    }
}

GatesOfTheMoon.code = '08038';

module.exports = GatesOfTheMoon;
