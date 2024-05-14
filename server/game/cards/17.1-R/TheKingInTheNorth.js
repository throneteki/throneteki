const PlotCard = require('../../plotcard.js');

class TheKingInTheNorth extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.cannotTriggerCardAbilities(
                (ability) =>
                    ['character', 'location', 'attachment'].includes(ability.card.getType()) &&
                    !(ability.card.hasTrait('King') || ability.card.hasTrait('Queen'))
            )
        });
    }
}

TheKingInTheNorth.code = '17159';

module.exports = TheKingInTheNorth;
