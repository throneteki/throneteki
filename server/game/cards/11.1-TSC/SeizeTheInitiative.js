import DrawCard from '../../drawcard.js';

class SeizeTheInitiative extends DrawCard {
    // Seize the Initiative (11013)
    // X is the number of opponents you have.
    // Interrupt: When the marshaling phase ends, you become the first player.
    setupCardAbilities() {
        this.xValue({
            value: (context) => this.game.getOpponents(context.player).length
        });

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
}

SeizeTheInitiative.code = '11013';

export default SeizeTheInitiative;
