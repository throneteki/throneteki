const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class BrownBenPlumm extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge' && this.controller.gold === 0
            },
            message:
                '{player} is forced to sacrifice {source} because they have no gold left in their gold pool',
            handler: (context) => {
                this.game.resolveGameAction(GameActions.sacrificeCard({ card: this }), context);
            }
        });
    }
}

BrownBenPlumm.code = '15016';

module.exports = BrownBenPlumm;
