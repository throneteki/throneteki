import PlotCard from '../../plotcard.js';

class TheKingInTheNorth extends PlotCard {
    // The King in the North (08080)
    // While a player does not control a King character, he or she cannot trigger abilities on
    // characters, locations, or attachments.
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

export default TheKingInTheNorth;
