import DrawCard from '../../drawcard.js';

class AegonTheConqueror extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({
            type: 'location',
            faction: 'targaryen',
            controller: 'current',
            unique: true
        });
        this.persistentEffect({
            condition: () =>
                this.controller.anyCardsInPlay({
                    type: 'character',
                    attacking: true,
                    trait: 'Dragon',
                    printedCostOrHigher: 7
                }),
            match: (card) => card === this.controller.activePlot,
            effect: ability.effects.modifyClaim(1)
        });
    }
}

AegonTheConqueror.code = '25074';

export default AegonTheConqueror;
