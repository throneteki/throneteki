import DrawCard from '../../drawcard.js';

class MerchantPrince extends DrawCard {
    // Merchant Prince (02013)
    // While Merchant Prince has an attachment, he gets +1 STR and gains a [military] icon.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.attachments.length >= 1,
            match: this,
            effect: [ability.effects.modifyStrength(1), ability.effects.addIcon('military')]
        });
    }
}

MerchantPrince.code = '02013';

export default MerchantPrince;
