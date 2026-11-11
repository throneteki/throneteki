import DrawCard from '../../drawcard.js';

class SerLancelLannister extends DrawCard {
    // Ser Lancel Lannister (05014)
    // While you control exactly 1 other [lannister] Lord or Lady character, Ser Lancel Lannister
    // gets +X STR. X is that character's STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !!singleOtherLannisterLordOrLady(context.source),
            match: this,
            effect: ability.effects.dynamicStrength((lancel) =>
                singleOtherLannisterLordOrLady(lancel).getStrength()
            )
        });
    }
}

function singleOtherLannisterLordOrLady(lancel) {
    const cards = lancel.controller.filterCardsInPlay(
        (card) =>
            card.isFaction('lannister') &&
            (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
            card.getType() === 'character' &&
            card !== lancel
    );

    return cards.length === 1 ? cards[0] : undefined;
}

SerLancelLannister.code = '05014';

export default SerLancelLannister;
