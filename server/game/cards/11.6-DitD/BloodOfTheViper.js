import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BloodOfTheViper extends DrawCard {
    // Blood of the Viper (11116)
    // Sand Snake character only. Ambush (2).
    // Reaction: After you lose a challenge in which attached character is participating, stand it.
    setupCardAbilities() {
        this.attachmentRestriction({ trait: 'Sand Snake' });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    context.source.parent.isParticipating() &&
                    context.source.parent.kneeled
            },
            message: {
                format: '{player} uses {source} to stand {parent}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.standCard((context) => ({ card: context.source.parent }))
        });
    }
}

BloodOfTheViper.code = '11116';

export default BloodOfTheViper;
