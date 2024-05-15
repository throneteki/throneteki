import DrawCard from '../../drawcard.js';

class GarthTheGross extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controlsTyrell('Lord'),
            match: this,
            effect: [ability.effects.addIcon('military'), ability.effects.addKeyword('Renown')]
        });
        this.persistentEffect({
            condition: () => this.controlsTyrell('Lady'),
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
