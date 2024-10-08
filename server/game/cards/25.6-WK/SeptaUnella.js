import DrawCard from '../../drawcard.js';

class SeptaUnella extends DrawCard {
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
