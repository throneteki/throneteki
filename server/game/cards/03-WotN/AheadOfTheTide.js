import DrawCard from '../../drawcard.js';

class AheadOfTheTide extends DrawCard {
    // Ahead of the Tide (03028)
    // Interrupt: When you compare initiative, your revealed plot card gets +3 initiative until the
    // end of the phase. If you win initiative this phase, draw 1 card.
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

export default AheadOfTheTide;
