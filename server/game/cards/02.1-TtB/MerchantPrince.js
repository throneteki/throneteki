import DrawCard from '../../drawcard.js';

class MerchantPrince extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.attachments.length >= 1,
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addIcon('military')]
        });
    }
}

MerchantPrince.code = '02013';

export default MerchantPrince;
