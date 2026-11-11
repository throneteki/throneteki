import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FeverDreams extends DrawCard {
    // Fever Dreams (06050)
    // Opponent's character only. Bestow (3).
    // Reaction: After attached character is knelt, discard 1 gold from Fever Dreams to draw 2
    // cards.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ controller: 'opponent' });
        this.reaction({
            when: {
                onCardKneeled: (event, context) =>
                    event.card === context.source.parent && context.source.controller.canDraw()
            },
            cost: ability.costs.discardGold(),
            message: '{player} discards a gold from {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

FeverDreams.code = '06050';

export default FeverDreams;
