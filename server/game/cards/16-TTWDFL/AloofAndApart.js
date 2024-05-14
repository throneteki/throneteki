import AgendaCard from '../../agendacard.js';

class AloofAndApart extends AgendaCard {
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
