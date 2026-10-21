import DrawCard from '../../drawcard.js';

class TheWolfswood extends DrawCard {
    // The Wolfswood (01155)
    // Each Direwolf card in your hand gains ambush (X). X is that card's printed cost.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: (card) => card.hasTrait('Direwolf'),
            effect: ability.effects.gainAmbush()
        });
    }
}

TheWolfswood.code = '01155';

export default TheWolfswood;
