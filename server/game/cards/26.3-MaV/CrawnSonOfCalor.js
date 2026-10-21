import DrawCard from '../../drawcard.js';

class CrawnSonOfCalor extends DrawCard {
    // Crawn Son of Calor (26045)
    // Shadow (4). Stealth.
    // You may marshal Crawn Son of Calor into shadows from your discard pile as if he were in your
    // hand.
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
