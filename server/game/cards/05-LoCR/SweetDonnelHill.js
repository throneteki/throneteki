import DrawCard from '../../drawcard.js';

class SweetDonnelHill extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: (card) => card.isAttacking() && card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.losesAllKeywords()
        });
    }
}

SweetDonnelHill.code = '05031';

export default SweetDonnelHill;
