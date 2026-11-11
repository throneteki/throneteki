import DrawCard from '../../drawcard.js';

class DonellaHornwood extends DrawCard {
    // Donella Hornwood (04021)
    // Reduce the cost of the first loyal card you marshal or play each round by 1.
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
