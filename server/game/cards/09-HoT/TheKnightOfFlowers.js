const DrawCard = require('../../drawcard.js');

class TheKnightOfFlowers extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: (event) => event.player === this.controller
            },
            handler: () => {
                this.game.addMessage(
                    '{0} uses {1} to gain +2 STR until the end of the phase',
                    this.controller,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    match: this,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

TheKnightOfFlowers.code = '09007';

module.exports = TheKnightOfFlowers;
