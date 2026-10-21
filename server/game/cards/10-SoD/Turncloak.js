import DrawCard from '../../drawcard.js';

class Turncloak extends DrawCard {
    // Turncloak (10032)
    // Non-loyal character only. Terminal.
    // Reaction: After you win a challenge in which attached character is participating, take
    // control of attached character. (Any player may initiate this ability.)
    setupCardAbilities() {
        this.attachmentRestriction({ loyal: false });
        this.reaction({
            when: {
                afterChallenge: (event) => event.challenge.isParticipating(this.parent)
            },
            player: () => this.game.currentChallenge.winner,
            handler: (context) => {
                this.game.takeControl(context.player, this.parent);
                this.game.addMessage(
                    '{0} uses {1} to take control of {2}',
                    context.player,
                    this,
                    this.parent
                );
            }
        });
    }
}

Turncloak.code = '10032';

export default Turncloak;
