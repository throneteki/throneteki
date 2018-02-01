const PlotCard = require('../../plotcard.js');

class TheKingInTheNorth extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            //This forces a recalculate for player level effects
            condition: () => true,
            match: player => !player.anyCardsInPlay(card => card.getType() === 'character' && card.hasTrait('King')),
            effect: ability.effects.cannotTriggerCardAbilities(card => ['character', 'location', 'attachment'].includes(card.getType()))
        });
    }
}

TheKingInTheNorth.code = '08080';

module.exports = TheKingInTheNorth;
