const PlotCard = require('../../plotcard.js');

class LionsOfTheRock extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) =>
                    event.phase === 'challenge' && this.controller.canGainGold()
            },
            handler: () => {
                let gold = this.game.addGold(this.controller, 3);
                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }
}

LionsOfTheRock.code = '05046';

module.exports = LionsOfTheRock;
