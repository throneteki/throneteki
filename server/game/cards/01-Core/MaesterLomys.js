import DrawCard from '../../drawcard.js';

class MaesterLomys extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.defendingPlayer === this.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            handler: () => {
                this.game.currentChallenge.loser.discardAtRandom(1);

                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from {2}'s hand",
                    this.controller,
                    this,
                    this.game.currentChallenge.loser
                );
            }
        });
    }
}

MaesterLomys.code = '01180';

export default MaesterLomys;
