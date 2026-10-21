import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

LeftHandLew.code = '19009';

export default LeftHandLew;
