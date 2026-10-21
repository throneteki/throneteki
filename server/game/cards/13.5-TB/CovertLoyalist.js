import DrawCard from '../../drawcard.js';

class CovertLoyalist extends DrawCard {
    // Covert Loyalist (13093)
    // Shadow (4).
    // Action: Discard a [targaryen] card with printed cost 4 or higher from your hand to put Covert
    // Loyalist into play from shadows.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put into play',
            location: 'shadows',
            condition: (context) => context.player.canPutIntoPlay(this, 'outOfShadows'),
            cost: ability.costs.discardFromHand({ faction: 'targaryen', printedCostOrHigher: 4 }),
            message: {
                format: '{player} uses {source} and discards {discardedCard} to put {source} into play from shadows',
                args: { discardedCard: (context) => context.costs.discardFromHand }
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
            }
        });
    }
}

CovertLoyalist.code = '13093';

export default CovertLoyalist;
