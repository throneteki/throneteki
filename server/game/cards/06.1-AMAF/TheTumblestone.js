import DrawCard from '../../drawcard.js';

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
            handler: (context) => {
                let standCard = context.event.card;
                standCard.controller.standCard(standCard);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to stand {2}',
                    this.controller,
                    this,
                    standCard
                );
            }
        });
    }
}

TheTumblestone.code = '06002';

export default TheTumblestone;
