import DrawCard from '../../drawcard.js';

class TytosBlackwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: () => this.isParticipating(),
            match: (card) => card.getType() === 'character' && card !== this && card.power === 0,
            effect: ability.effects.blankExcludingTraits
        });
    }
}

TytosBlackwood.code = '26071';

export default TytosBlackwood;
