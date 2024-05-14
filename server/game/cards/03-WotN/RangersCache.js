const PlotCard = require('../../plotcard.js');

class RangersCache extends PlotCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'taxation' &&
                    (this.controller.canGainGold() || this.controller.canDraw())
            },
            choices: {
                'Gain 3 gold': () => {
                    if (this.controller.canGainGold()) {
                        let gold = this.game.addGold(this.controller, 3);
                        this.game.addMessage(
                            '{0} uses {1} to gain {2} gold',
                            this.controller,
                            this,
                            gold
                        );
                    }
                },
                'Draw 2 cards': () => {
                    if (this.controller.canDraw()) {
                        let cards = this.controller.drawCardsToHand(2).length;
                        this.game.addMessage(
                            '{0} uses {1} to draw {2} card',
                            this.controller,
                            this,
                            cards
                        );
                    }
                }
            }
        });
    }
}

RangersCache.code = '03052';

module.exports = RangersCache;
