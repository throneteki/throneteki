import AgendaCard from '../../agendacard.js';

class KingdomOfShadows extends AgendaCard {
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
