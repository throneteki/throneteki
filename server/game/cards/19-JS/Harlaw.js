const DrawCard = require('../../drawcard.js');

class Harlaw extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyReserve(-1)
        });
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'marshal',
                amount: 1,
                match: (card) => card.hasTrait('House Harlaw')
            })
        });
        this.plotModifiers({
            reserve: 1
        });
    }
}

Harlaw.code = '19003';

module.exports = Harlaw;
