import DrawCard from '../../drawcard.js';

class Sweetsleep extends DrawCard {
    // Sweetsleep (20047)
    // Terminal.
    // Treat the printed text box of each other attachment attached to the attached card as if it
    // were blank (except for Traits).
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !!context.source.parent,
            match: (card, context) =>
                card.parent === context.source.parent &&
                card.getType() === 'attachment' &&
                card !== context.source,
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

Sweetsleep.code = '20047';

export default Sweetsleep;
