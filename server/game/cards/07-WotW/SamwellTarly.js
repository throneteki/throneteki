import DrawCard from '../../drawcard.js';

class SamwellTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) =>
                card !== this &&
                card.isParticipating() &&
                !card.hasTrait('Steward') &&
                card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.blankExcludingTraits
        });
    }
}

SamwellTarly.code = '07012';

export default SamwellTarly;
