const PlotCard = require('../../plotcard.js');

class TheKingInTheNorth extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            match: player => !player.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('King')),
            effect: ability.effects.cannotTriggerCardAbilities(card => ['character', 'location', 'attachment'].includes(card.getType()))
        });
    }
}

TheKingInTheNorth.code = '08080';

module.exports = TheKingInTheNorth;
