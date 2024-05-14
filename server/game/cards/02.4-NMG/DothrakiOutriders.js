import DrawCard from '../../drawcard.js';

class DothrakiOutriders extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', () => this.getNumberOfDothraki())
        });
    }

    getNumberOfDothraki() {
        return this.controller.getNumberOfCardsInPlay(
            (card) => card.hasTrait('Dothraki') && card.getType() === 'character'
        );
    }
}

DothrakiOutriders.code = '02074';

export default DothrakiOutriders;
