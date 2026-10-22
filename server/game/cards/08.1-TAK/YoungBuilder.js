import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class YoungBuilder extends DrawCard {
    // Young Builder (08006)
    // Bestow (3). No attachments except Weapon.
    // Reaction: After a [thenightswatch] location or attachment enters play under your control,
    // discard 1 gold from Young Builder to draw 1 card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.isFaction('thenightswatch') &&
                    ['location', 'attachment'].includes(event.card.getType()) &&
                    event.card.controller === context.source.controller &&
                    context.source.controller.canDraw()
            },
            cost: ability.costs.discardGold(),
            message: '{player} discards 1 gold from {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

YoungBuilder.code = '08006';

export default YoungBuilder;
