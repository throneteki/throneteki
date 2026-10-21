import DrawCard from '../../drawcard.js';

class LeytonHightower extends DrawCard {
    // Leyton Hightower (10037)
    // Action: Kneel Leyton Hightower to put a non-limited [tyrell] card with printed cost 4 or
    // lower into play from your hand knelt.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into play',
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    !card.isLimited() &&
                    card.isFaction('tyrell') &&
                    card.getPrintedCost() <= 4 &&
                    this.controller.canPutIntoPlay(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target, 'play', { kneeled: true });
                this.game.addMessage(
                    '{0} kneels {1} to put {2} into play from their hand knelt',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

LeytonHightower.code = '10037';

export default LeytonHightower;
