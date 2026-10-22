import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MagisterIllyrio extends DrawCard {
    // Magister Illyrio (01163)
    // Action: Pay 2 gold to choose and stand a character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a character',
            limit: ability.limit.perPhase(1),
            cost: ability.costs.payGold(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message: '{player} uses {source} to pay 2 gold and stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

MagisterIllyrio.code = '01163';

export default MagisterIllyrio;
