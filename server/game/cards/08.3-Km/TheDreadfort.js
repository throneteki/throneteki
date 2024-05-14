import DrawCard from '../../drawcard.js';

class TheDreadfort extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event) =>
                    event.cardStateWhenSacrificed.controller === this.controller &&
                    event.cardStateWhenSacrificed.getType() === 'character'
            },
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasTrait('House Bolton') || !card.isFaction('stark')) &&
                    card.kneeled,
                gameAction: 'stand'
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

TheDreadfort.code = '08042';

export default TheDreadfort;
