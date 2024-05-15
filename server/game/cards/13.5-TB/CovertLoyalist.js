import DrawCard from '../../drawcard.js';

class CovertLoyalist extends DrawCard {
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
