const PlotCard = require('../../plotcard');
const TextHelper = require('../../TextHelper');

class SiegePreparations extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw cards',
            phase: 'dominance',
            condition: () =>
                this.controller.canDraw() &&
                this.controller.getTotalReserve() > this.controller.hand.length,
            handler: (context) => {
                let cardsToDraw = context.player.getTotalReserve() - context.player.hand.length;
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

module.exports = SiegePreparations;
