import DrawCard from '../../drawcard.js';

class YoungBuilder extends DrawCard {
    // Young Builder (08006)
    // Bestow (3). No attachments except Weapon.
    // Reaction: After a [thenightswatch] location or attachment enters play under your control,
    // discard 1 gold from Young Builder to draw 1 card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.isFaction('thenightswatch') &&
                    ['location', 'attachment'].includes(event.card.getType()) &&
                    event.card.controller === this.controller &&
                    this.controller.canDraw()
            },
            cost: ability.costs.discardGold(),
            handler: (context) => {
                context.player.drawCardsToHand(1);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to draw 1 card',
                    context.player,
                    this
                );
            }
        });
    }
}

YoungBuilder.code = '08006';

export default YoungBuilder;
