import DrawCard from '../../drawcard.js';

class JeyneWesterling extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a King or Lord',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.isFaction('stark') &&
                    card.getType() === 'character' &&
                    (card.hasTrait('King') || card.hasTrait('Lord')) &&
                    card.kneeled,
                gameAction: 'stand'
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.addMessage(
                    '{0} kneels {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

JeyneWesterling.code = '05033';

export default JeyneWesterling;
