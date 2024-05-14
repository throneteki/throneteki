const DrawCard = require('../../drawcard.js');

class DagmerCleftjaw extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.anyPlotHasTrait('Winter'),
            targetController: 'current',
            effect: ability.effects.canMarshalIntoShadows(
                (card) => card === this && card.location === 'dead pile'
            )
        });
    }
}

DagmerCleftjaw.code = '24004';

module.exports = DagmerCleftjaw;
