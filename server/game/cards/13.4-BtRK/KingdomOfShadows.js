import AgendaCard from '../../agendacard.js';

class KingdomOfShadows extends AgendaCard {
    // Kingdom of Shadows (13079)
    // You may include non-loyal characters with the printed shadow keyword from any faction in your
    // deck.
    // Increase the cost of each character you marshal by 1. Reduce the cost of the first character
    // you bring out of shadows each round by 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.increaseCost({
                playingTypes: ['marshal'],
                amount: 1,
                match: (card) => card.getType() === 'character'
            })
        });

        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstOutOfShadowsCardCostEachRound(
                2,
                (card) => card.getType() === 'character'
            )
        });
    }
}

KingdomOfShadows.code = '13079';

export default KingdomOfShadows;
