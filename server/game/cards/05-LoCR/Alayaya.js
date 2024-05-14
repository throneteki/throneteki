const DrawCard = require('../../drawcard.js');

class Alayaya extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.isParticipating() &&
                    event.challenge.loser.gold >= 1
            },
            handler: (context) => {
                let otherPlayer = context.event.challenge.loser;

                this.game.transferGold({ from: otherPlayer, to: this.controller, amount: 1 });
                this.game.addMessage(
                    "{0} uses {1} to move 1 gold from {2}'s gold pool to their own",
                    this.controller,
                    this,
                    otherPlayer
                );
            }
        });
    }
}

Alayaya.code = '05013';

module.exports = Alayaya;
