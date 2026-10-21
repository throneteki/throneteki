import DrawCard from '../../drawcard.js';

class HouseYronwoodKnight extends DrawCard {
    // House Yronwood Knight (08095)
    // Reaction: After you lose a challenge in which House Yronwood Knight is participating, discard
    // 1 card at random from the winning opponent's hand.
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

export default HouseYronwoodKnight;
