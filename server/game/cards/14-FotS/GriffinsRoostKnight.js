const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class GriffinsRoostKnight extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'challenge' && this.controller.getNumberOfChallengesLost('power') === 0 && this.allowGameAction('stand')
            },
            message: '{player} uses {source} to stand {source}',
            handler: () => {
                this.game.resolveGameAction(
                    GameActions.standCard({ card: this })
                );
            }
        });
    }
}

GriffinsRoostKnight.code = '14009';

module.exports = GriffinsRoostKnight;
