const PlotCard = require('../../plotcard.js');

class TheLongPlan extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 gold from losing a challenge', this.controller, this);
                this.game.addGold(this.controller, 1);
            }
        });
        this.persistentEffect({
            targetType: 'player',
            effect: ability.effects.doesNotReturnUnspentGold()
        });
    }
}

TheLongPlan.code = '02016';

module.exports = TheLongPlan;
