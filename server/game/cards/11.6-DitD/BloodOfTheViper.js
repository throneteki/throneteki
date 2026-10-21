import DrawCard from '../../drawcard.js';

class BloodOfTheViper extends DrawCard {
    // Blood of the Viper (11116)
    // Sand Snake character only. Ambush (2).
    // Reaction: After you lose a challenge in which attached character is participating, stand it.
    setupCardAbilities() {
        this.attachmentRestriction({ trait: 'Sand Snake' });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.loser === this.controller &&
                    this.parent.isParticipating() &&
                    this.parent.kneeled
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    this.parent
                );
                context.player.standCard(this.parent);
            }
        });
    }
}

BloodOfTheViper.code = '11116';

export default BloodOfTheViper;
