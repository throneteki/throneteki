const DrawCard = require('../../drawcard.js');

class QuentynMartell extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onPhaseStarted: (event) =>
                    event.phase === 'challenge' && this.controller.getNumberOfUsedPlots() < 3
            },
            handler: (context) => {
                context.player.kneelCard(this);
                this.game.addMessage('{0} is forced to kneel {1}', context.player, this);
            }
        });
    }
}

QuentynMartell.code = '10011';

module.exports = QuentynMartell;
