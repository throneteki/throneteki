const DrawCard = require('../../drawcard.js');

class Butterbumps extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && this.isParticipating()
            },
            handler: () => {
                this.controller.discardAtRandom(1);
                this.game.addMessage(
                    '{0} is forced to use {1} to discard a card from their hand after losing a challenge',
                    this.controller,
                    this
                );
            }
        });
    }
}

Butterbumps.code = '02103';

module.exports = Butterbumps;
