const DrawCard = require('../../drawcard');

class BloodOfTheViper extends DrawCard {
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

module.exports = BloodOfTheViper;
