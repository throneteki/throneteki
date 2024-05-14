import DrawCard from '../../drawcard.js';

class MoonBoy extends DrawCard {
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
