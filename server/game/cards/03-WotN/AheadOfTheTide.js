const DrawCard = require('../../drawcard.js');

class AheadOfTheTide extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCompareInitiative: () => true
            },
            handler: () => {
                this.game.addMessage(
                    '{0} uses {1} to increase initiative on their plot by 3',
                    this.controller,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    match: (card) => card === this.controller.activePlot,
                    effect: ability.effects.modifyInitiative(3)
                }));
                this.game.once('onInitiativeDetermined', (event) => {
                    if (event.winner === this.controller && this.controller.canDraw()) {
                        this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                        this.controller.drawCardsToHand(1);
                    }
                });
            }
        });
    }
}

AheadOfTheTide.code = '03028';

module.exports = AheadOfTheTide;
