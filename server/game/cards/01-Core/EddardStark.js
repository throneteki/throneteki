import DrawCard from '../../drawcard.js';

class EddardStark extends DrawCard {
    // Eddard Stark (01144)
    // Renown.
    // Reaction: After a challenge is initiated against you, stand Eddard Stark.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event) =>
                    event.challenge.initiatedAgainstPlayer === this.controller && this.kneeled
            },
            handler: () => {
                this.controller.standCard(this);

                this.game.addMessage('{0} uses {1} to stand {1}', this.controller, this);
            }
        });
    }
}

EddardStark.code = '01144';

export default EddardStark;
