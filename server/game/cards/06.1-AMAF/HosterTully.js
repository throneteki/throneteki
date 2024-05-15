import DrawCard from '../../drawcard.js';

class HosterTully extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isParticipating(),
            match: (card) =>
                card !== this && card.isParticipating() && card.hasTrait('House Tully'),
            effect: ability.effects.addKeyword('Renown')
        });
    }
}

HosterTully.code = '06001';

export default HosterTully;
