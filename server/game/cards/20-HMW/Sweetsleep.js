import DrawCard from '../../drawcard.js';

class Sweetsleep extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => !!this.parent,
            match: (card) =>
                card.parent === this.parent && card.getType() === 'attachment' && card !== this,
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

Sweetsleep.code = '20047';

export default Sweetsleep;
