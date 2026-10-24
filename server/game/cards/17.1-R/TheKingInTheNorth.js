import PlotCard from '../../plotcard.js';

class TheKingInTheNorth extends PlotCard {
    // The King in the North (17159)
    // Players cannot trigger abilities on characters, locations, or attachments, unless those cards
    // have the King or Queen trait.
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

export default TheKingInTheNorth;
