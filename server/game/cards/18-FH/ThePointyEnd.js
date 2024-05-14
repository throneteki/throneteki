const PlotCard = require('../../plotcard');

class ThePointyEnd extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                if (context.target.attachments.length > 1) {
                    this.game.addMessage(
                        '{0} uses {1} to discard each attachment from {2}',
                        this.controller,
                        this,
                        context.target
                    );
                    context.target.attachments.forEach((card) => card.controller.discardCard(card));
                } else {
                    this.game.addMessage(
                        '{0} uses {1} to discard each duplicate and power from {2}',
                        this.controller,
                        this,
                        context.target
                    );
                    if (context.target.dupes) {
                        context.target.dupes.forEach((card) => card.controller.discardCard(card));
                    }
                    if (context.target.getPower() > 0) {
                        context.target.modifyPower(-context.target.getPower());
                    }
                }
            }
        });
    }
}

ThePointyEnd.code = '18020';

module.exports = ThePointyEnd;
