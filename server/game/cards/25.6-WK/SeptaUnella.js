import DrawCard from '../../drawcard.js';

class SeptaUnella extends DrawCard {
    // Septa Unella (25117)
    // While Septa Unella is participating in a challenge, treat each other non-The Seven character
    // with 1 or more power as if its printed text box were blank (except for Traits).
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) =>
                card !== this &&
                !card.hasTrait('The Seven') &&
                card.getType() === 'character' &&
                card.power > 0,
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

SeptaUnella.code = '25117';

export default SeptaUnella;
