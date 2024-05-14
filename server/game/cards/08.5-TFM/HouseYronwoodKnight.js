const DrawCard = require('../../drawcard.js');

class HouseYronwoodKnight extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && this.isParticipating()
            },
            handler: () => {
                let winner = this.game.currentChallenge.winner;
                winner.discardAtRandom(1);

                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from {2}'s hand",
                    this.controller,
                    this,
                    winner
                );
            }
        });
    }
}

HouseYronwoodKnight.code = '08095';

module.exports = HouseYronwoodKnight;
