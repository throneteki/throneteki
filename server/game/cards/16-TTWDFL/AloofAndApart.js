import AgendaCard from '../../agendacard.js';

class AloofAndApart extends AgendaCard {
    // Aloof and Apart (16027)
    // Reduce the cost of the first character with printed cost 6 or higher you marshal each round
    // by 2.
    // Each character you control with printed cost 6 or higher gains prized 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(2, (card) =>
                card.isMatch({ type: 'character', printedCostOrHigher: 6 })
            )
        });

        this.persistentEffect({
            condition: () => true,
            match: (card) => card.isMatch({ type: 'character', printedCostOrHigher: 6 }),
            targetController: 'current',
            effect: ability.effects.addKeyword('Prized 1')
        });
    }
}

AloofAndApart.code = '16027';

export default AloofAndApart;
