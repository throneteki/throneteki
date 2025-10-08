import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IbbeneseWhaler extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshaledCardIntoShadowsEachRound(1)
        });
        this.action({
            title: 'Draw cards',
            phase: 'taxation',
            condition: (context) => context.player.getHandCount() === 0,
            cost: [ability.costs.kneelSelf(), ability.costs.putSelfIntoShadows()],
            message: '{player} kneels {costs.kneel} and returns it to shadows to draw 2 cards',
            gameAction: GameActions.drawCards({ amount: 2 })
        });
    }
}

IbbeneseWhaler.code = '26078';

export default IbbeneseWhaler;
