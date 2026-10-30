import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheTumblestone extends DrawCard {
    // The Tumblestone (06002)
    // Bestow (3).
    // Reaction: After a House Tully character gains power, discard 1 gold from The Tumblestone to
    // stand that character.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.hasTrait('House Tully') &&
                    event.card.kneeled
            },
            cost: ability.costs.discardGold(),
            message: {
                format: '{player} discards 1 gold from {source} to stand {standCard}',
                args: { standCard: (context) => context.event.card }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.event.card }))
        });
    }
}

TheTumblestone.code = '06002';

export default TheTumblestone;
