const DrawCard = require('../../drawcard');

class SeizeTheInitiative extends DrawCard {
    setupCardAbilities() {
        this.xValue({
            value: context => this.game.getOpponents(context.player).length
        });

        this.interrupt({
            when: {
                onPhaseEnded: event => event.phase === 'marshal' && !this.controller.firstPlayer
            },
            handler: () => {
                this.game.setFirstPlayer(this.controller);
                this.game.addMessage('{0} plays {1} to become first player', this.controller, this);
            }
        });
    }
}

SeizeTheInitiative.code = '11013';

module.exports = SeizeTheInitiative;
