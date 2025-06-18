import DrawCard from '../../drawcard.js';

class SeizeTheInitiative extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'marshal' && !this.controller.firstPlayer
            },
            handler: () => {
                this.game.addMessage('{0} plays {1} to become first player', this.controller, this);
                this.game.setFirstPlayer(this.controller);
            }
        });
    }

    getCost() {
        let opponents = this.game.getOpponents(this.controller);
        return opponents.length;
    }
}

SeizeTheInitiative.code = '11013';

export default SeizeTheInitiative;
