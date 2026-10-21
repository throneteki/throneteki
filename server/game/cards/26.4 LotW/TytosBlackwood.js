import DrawCard from '../../drawcard.js';

class TytosBlackwood extends DrawCard {
    // Tytos Blackwood (26071)
    // Renown.
    // While Tytos Blackwood is participating in a challenge, treat each other character without
    // power as if its printed text box were blank (except for Traits).
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
