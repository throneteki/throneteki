import PlotCard from '../../plotcard.js';
import TextHelper from '../../TextHelper.js';

class SiegePreparations extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'dominance',
            condition: () =>
                this.controller.canDraw() &&
                this.controller.getReserve() > this.controller.getHandCount(),
            handler: (context) => {
                let cardsToDraw = context.player.getReserve() - context.player.getHandCount();
                let numDrawn = context.player.drawCardsToHand(cardsToDraw).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numDrawn, 'card')
                );
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

SiegePreparations.code = '14048';

export default SiegePreparations;
