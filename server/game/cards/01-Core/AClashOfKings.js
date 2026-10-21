import PlotCard from '../../plotcard.js';

class AClashOfKings extends PlotCard {
    // A Clash of Kings (01001)
    // Reaction: After you win a [power] challenge, move 1 power from the losing opponent's faction
    // card to your own.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.loser.faction.power > 0
            },
            handler: () => {
                let challenge = this.game.currentChallenge;
                this.game.movePower(challenge.loser.faction, challenge.winner.faction, 1);

                this.game.addMessage(
                    "{0} uses {1} to move 1 power from {2}'s faction card to their own",
                    challenge.winner,
                    this,
                    challenge.loser
                );
            }
        });
    }
}

AClashOfKings.code = '01001';

export default AClashOfKings;
