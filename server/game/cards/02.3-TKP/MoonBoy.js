import DrawCard from '../../drawcard.js';

class MoonBoy extends DrawCard {
    // Moon Boy (02047)
    // Insight.
    // Forced Reaction: After you lose a challenge in which Moon Boy is participating, discard 1
    // card at random from your hand.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller && this.isParticipating()
            },
            handler: () => {
                this.game.addMessage(
                    '{0} is forced to discard 1 card at random after losing a challenge in which {1} was participating',
                    this.controller,
                    this
                );
                this.controller.discardAtRandom(1);
            }
        });
    }
}

MoonBoy.code = '02047';

export default MoonBoy;
