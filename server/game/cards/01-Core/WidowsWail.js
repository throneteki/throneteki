import DrawCard from '../../drawcard.js';

class WidowsWail extends DrawCard {
    // Widow's Wail (01096)
    // Ambush (1).
    // Attached character gets +2 STR.
    // If attached character is Joffrey Baratheon, he gains a [military] icon.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.whileAttached({
            match: (card) => card.name === 'Joffrey Baratheon',
            effect: ability.effects.addIcon('military')
        });
    }
}

WidowsWail.code = '01096';

export default WidowsWail;
