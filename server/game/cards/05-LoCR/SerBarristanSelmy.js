import DrawCard from '../../drawcard.js';

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    this.controller.hand.length < event.challenge.loser.hand.length
            },
            handler: () => {
                this.controller.standCard(this);
                this.game.addMessage('{0} uses {1} to stand {1}', this.controller, this, this);
            }
        });
    }
}

SerBarristanSelmy.code = '05035';

export default SerBarristanSelmy;
