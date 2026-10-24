import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheDreadfort extends DrawCard {
    // The Dreadfort (08042)
    // Reaction: After a character you control is sacrificed, kneel The Dreadfort to choose and
    // stand a House Bolton or non-[stark] character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, context) =>
                    event.cardStateWhenSacrificed.controller === context.source.controller &&
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
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

TheDreadfort.code = '08042';

export default TheDreadfort;
