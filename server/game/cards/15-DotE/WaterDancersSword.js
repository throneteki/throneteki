const DrawCard = require('../../drawcard.js');

class WaterDancersSword extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ printedCostOrLower: 3 });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge'
            },
            handler: context => {
                context.player.moveCard(this, 'hand');

                this.game.addMessage('{0} is forced to return {1} to their hand', this.controller, this);
            }
        });
    }
}

WaterDancersSword.code = '15043';

module.exports = WaterDancersSword;
