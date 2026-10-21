import DrawCard from '../../drawcard.js';

class Sweetsleep extends DrawCard {
    // Sweetsleep (20047)
    // Terminal.
    // Treat the printed text box of each other attachment attached to the attached card as if it
    // were blank (except for Traits).
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
