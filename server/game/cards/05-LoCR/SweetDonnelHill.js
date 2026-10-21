import DrawCard from '../../drawcard.js';

class SweetDonnelHill extends DrawCard {
    // Sweet Donnel Hill (05031)
    // No attachments except Weapon.
    // While Sweet Donnel Hill is defending, each attacking character loses all keywords.
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
