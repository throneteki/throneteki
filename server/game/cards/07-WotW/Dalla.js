import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Dalla extends DrawCard {
    // Dalla (07040)
    // Reaction: After a Wildling character enters play under your control, draw 1 card. (Limit once
    // per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.controller === context.source.controller &&
                    event.card.hasTrait('Wildling') &&
                    event.card.getType() === 'character' &&
                    context.source.controller.canDraw()
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

Dalla.code = '07040';

export default Dalla;
