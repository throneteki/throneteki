import DrawCard from '../../drawcard.js';

class GarthTheGross extends DrawCard {
    // Garth the Gross (09009)
    // While you control another [tyrell] Lord character, Garth the Gross gains a [military] icon
    // and renown.
    // While you control a [tyrell] Lady character, Garth the Gross gains an [intrigue] icon and
    // gets +2 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controlsTyrell('Lord'),
            match: this,
            effect: [ability.effects.addIcon('military'), ability.effects.addKeyword('Renown')]
        });
        this.persistentEffect({
            condition: (context) => context.source.controlsTyrell('Lady'),
            match: this,
            effect: [ability.effects.addIcon('intrigue'), ability.effects.modifyStrength(2)]
        });
    }

    controlsTyrell(trait) {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.getType() === 'character' &&
                card.isFaction('tyrell') &&
                card.hasTrait(trait) &&
                card !== this
        );
    }
}

GarthTheGross.code = '09009';

export default GarthTheGross;
