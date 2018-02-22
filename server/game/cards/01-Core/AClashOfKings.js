const PlotCard = require('../../plotcard.js');

class AClashOfKings extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.loser.faction.power > 0
                )
            },
            handler: () => {
                var challenge = this.game.currentChallenge;
                this.game.addMessage('{0} uses {1} to move 1 power from {2}\'s faction card to their own', challenge.winner, this, challenge.loser);
                this.game.movePower(challenge.loser.faction, challenge.winner.faction, 1);
            }
        });
    }
}

AClashOfKings.code = '01001';

module.exports = AClashOfKings;
