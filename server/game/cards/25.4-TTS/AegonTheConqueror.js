import DrawCard from '../../drawcard.js';

class AegonTheConqueror extends DrawCard {
    // Aegon the Conqueror (25074)
    // Unique [targaryen] location you control only.
    // During a challenge in which you control an attacking Dragon character with printed cost 7 or
    // higher, raise the claim value on your revealed plot card by 1.
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
