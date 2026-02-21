import DrawCard from '../../drawcard.js';

class AncientTraditions extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'stark' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.whileAttached({
            condition: () => this.parent.hasTrait('Old Gods'),
            effect: ability.effects.immuneTo((card) => card.controller !== this.controller)
        });
    }
}

AncientTraditions.code = '27567';
AncientTraditions.version = '1.0.0';

export default AncientTraditions;
