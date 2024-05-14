const DrawCard = require('../../drawcard');

class SeizeTheInitiative extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'marshal' && !this.controller.firstPlayer
            },
            handler: () => {
                this.game.setFirstPlayer(this.controller);
                this.game.addMessage('{0} plays {1} to become first player', this.controller, this);
            }
        });
    }

    getCost() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.length;
    }
}

SeizeTheInitiative.code = '11013';

module.exports = SeizeTheInitiative;
