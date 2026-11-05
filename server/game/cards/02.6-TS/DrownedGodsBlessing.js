import DrawCard from '../../drawcard.js';

class DrownedGodsBlessing extends DrawCard {
    // Drowned God's Blessing (02112)
    // [greyjoy] character only.
    // Attached character gains the Drowned God trait and cannot be chosen as the only target of
    // opponents' events.
    // +1 Initiative.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'greyjoy' });
        this.whileAttached({
            effect: [
                ability.effects.addTrait('Drowned God'),
                ability.effects.cannotTarget(
                    (context, effectContext) =>
                        (!context.selectedCards ||
                            context.selectedCards.every(
                                (card) => card === effectContext.source.parent
                            )) &&
                        context.source &&
                        context.source.getType() === 'event' &&
                        context.source.controller !== effectContext.source.controller
                )
            ]
        });
        this.plotModifiers({
            initiative: 1
        });
    }
}

DrownedGodsBlessing.code = '02112';

export default DrownedGodsBlessing;
