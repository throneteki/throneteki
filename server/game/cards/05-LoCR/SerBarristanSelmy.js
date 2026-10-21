import DrawCard from '../../drawcard.js';

class SerBarristanSelmy extends DrawCard {
    // Ser Barristan Selmy (05035)
    // Reaction: After you win a challenge in which Ser Barristan Selmy is participating, if you
    // have fewer cards in hand than the losing opponent, stand him.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    this.controller.getHandCount() < event.challenge.loser.getHandCount()
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
