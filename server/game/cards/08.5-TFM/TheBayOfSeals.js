import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheBayOfSeals extends DrawCard {
    // The Bay of Seals (08086)
    // Action: Kneel The Bay of Seals to choose and stand a character owned by an opponent.
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand character',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.kneeled &&
                    card.owner !== context.source.controller
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

TheBayOfSeals.code = '08086';

export default TheBayOfSeals;
