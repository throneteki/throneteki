import DrawCard from '../../drawcard.js';

class SerWaymarRoyce extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this
            },
            handler: () => {
                this.game.addMessage(
                    "{0} uses {1} to 1 card at random from each opponent's hand",
                    this.controller,
                    this
                );
                for (let opponent of this.game.getOpponents(this.controller)) {
                    opponent.discardAtRandom(1);
                }
            }
        });
    }
}

SerWaymarRoyce.code = '01128';

export default SerWaymarRoyce;
