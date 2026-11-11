import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LeftHandLew extends DrawCard {
    // Left Hand Lew (19009)
    // No attachments except Weapon.
    // Action: Kneel Left Hand Lew to choose and stand a character owned by an opponent.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    card.owner !== context.player
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

LeftHandLew.code = '19009';

export default LeftHandLew;
