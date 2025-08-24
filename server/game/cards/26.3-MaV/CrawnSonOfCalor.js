import DrawCard from '../../drawcard.js';

class CrawnSonOfCalor extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'current',
            effect: ability.effects.canMarshalIntoShadows(
                (card) => card === this && card.location === 'discard pile'
            )
        });
    }
}

CrawnSonOfCalor.code = '26045';

export default CrawnSonOfCalor;
