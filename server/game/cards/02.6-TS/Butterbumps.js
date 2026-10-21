import DrawCard from '../../drawcard.js';

class Butterbumps extends DrawCard {
    // Butterbumps (02103)
    // Insight.
    // Forced Reaction: After you lose a challenge in which Butterbumps is participating, discard 1
    // card at random from your hand.
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

export default Butterbumps;
