import PlotCard from '../../plotcard.js';

class ThePointyEnd extends PlotCard {
    // The Pointy End (18020)
    // When Revealed: Choose a character. If there are 2 or more attachments attached to that
    // character, discard each attachment from it. Otherwise, discard each duplicate and each power
    // from it.
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

export default ThePointyEnd;
