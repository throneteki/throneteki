import DrawCard from '../../drawcard.js';

class JonSnow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            limit: ability.limit.perRound(1),
            cost: ability.costs.sacrifice(
                (card) => card.isFaction('stark') && card.getType() === 'character'
            ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.kneeled &&
                    card.isUnique() &&
                    card.isFaction('stark') &&
                    card.getType() === 'character',
                gameAction: 'stand'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} and sacrifices {2} to stand {3}',
                    this.controller,
                    this,
                    context.costs.sacrifice,
                    context.target
                );
                context.target.controller.standCard(context.target);
            }
        });
    }
}

JonSnow.code = '03005';

export default JonSnow;
