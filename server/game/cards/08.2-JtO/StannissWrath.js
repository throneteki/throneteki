import DrawCard from '../../drawcard.js';

class StannissWrath extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel character',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasIcon('power'),
                gameAction: 'kneel'
            },
            handler: (context) => {
                context.target.controller.kneelCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to kneel {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

StannissWrath.code = '08028';

export default StannissWrath;
