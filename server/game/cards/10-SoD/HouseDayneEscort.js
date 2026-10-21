import DrawCard from '../../drawcard.js';

class HouseDayneEscort extends DrawCard {
    // House Dayne Escort (10015)
    // While there are 3 or more plot cards in your used pile, you may marshal House Dayne Escort
    // from your discard pile as if it were in your hand.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () =>
                this.location === 'discard pile' && this.controller.getNumberOfUsedPlots() >= 3,
            targetController: 'current',
            effect: ability.effects.canMarshal(
                (card) => card === this && card.location === 'discard pile'
            )
        });
    }
}

HouseDayneEscort.code = '10015';

export default HouseDayneEscort;
