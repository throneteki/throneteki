import AgendaCard from '../../agendacard.js';

class KingdomOfShadows extends AgendaCard {
    // Kingdom of Shadows (17148)
    // You may include non-loyal characters with the printed shadow keyword from any faction in your
    // deck.
    // While you control no in-faction characters, increase the cost to marshal each of your cards
    // into shadows by 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay(
                    (card) =>
                        card.getType() === 'character' &&
                        card.isFaction(context.source.controller.faction.getPrintedFaction())
                ),
            targetController: 'current',
            effect: ability.effects.increaseCost({
                playingTypes: 'marshalIntoShadows',
                amount: 1
            })
        });
    }
}

KingdomOfShadows.code = '17148';

export default KingdomOfShadows;
