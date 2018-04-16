const DrawCard = require('../../drawcard.js');

class DrownedGodsBlessing extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'greyjoy' });
        this.whileAttached({
            effect: [
                ability.effects.addTrait('Drowned God'),
                ability.effects.cannotTarget(context => {
                    return context.selectedCards.every(card => card === this.parent) && context.source.getType() === 'event';
                })
            ]
        });
        this.plotModifiers({
            initiative: 1
        });
    }
}

DrownedGodsBlessing.code = '02112';

module.exports = DrownedGodsBlessing;
