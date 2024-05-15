import DrawCard from '../../drawcard.js';

class DonellaHornwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledOrPlayedCardCostEachRound(1, (card) =>
                card.isLoyal()
            )
        });
    }
}

DonellaHornwood.code = '04021';

export default DonellaHornwood;
