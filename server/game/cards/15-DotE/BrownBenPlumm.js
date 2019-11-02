const DrawCard = require('../../drawcard');

class BrownBenPlumm extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge' && this.controller.gold === 0
            },
            handler: () => {
                this.controller.sacrificeCard(this);
                this.game.addMessage('{0} sacrifices {1} because they have no gold left in their gold pool',
                    this.controller, this);
            }
        });
    }
}

BrownBenPlumm.code = '15016';

module.exports = BrownBenPlumm;
