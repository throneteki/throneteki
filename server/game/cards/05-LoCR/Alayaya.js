const DrawCard = require('../../drawcard.js');

class Alayaya extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: event => (
                    event.challenge.winner === this.controller &&
                    event.challenge.isParticipating(this) &&
                    event.challenge.loser.gold >= 1)
            },
            handler: context => {
                let otherPlayer = context.event.challenge.loser;

                this.game.addGold(otherPlayer, -1);
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to move 1 gold from {2}\'s gold pool to their own', this.controller, this, otherPlayer);
            }
        });
    }
}

Alayaya.code = '05013';

module.exports = Alayaya;
