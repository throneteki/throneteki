const PlotCard = require('../../plotcard.js');

class TheKingInTheNorth extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (player) =>
                !player.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasTrait('King')
                ),
            effect: ability.effects.cannotTriggerCardAbilities((ability) =>
                ['character', 'location', 'attachment'].includes(ability.card.getType())
            )
        });
    }
}

TheKingInTheNorth.code = '08080';

module.exports = TheKingInTheNorth;
