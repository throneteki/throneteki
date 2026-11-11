import DrawCard from '../../drawcard.js';

class RaiderFromPyke extends DrawCard {
    // Raider from Pyke (02091)
    // Each Weapon card in your hand gains ambush (X). X is that card's printed cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card) => card.hasTrait('Weapon'),
            effect: ability.effects.gainAmbush()
        });
    }
}

RaiderFromPyke.code = '02091';

export default RaiderFromPyke;
