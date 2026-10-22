import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EddardStark extends DrawCard {
    // Eddard Stark (01144)
    // Renown.
    // Reaction: After a challenge is initiated against you, stand Eddard Stark.
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.source.controller &&
                    context.source.kneeled
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

EddardStark.code = '01144';

export default EddardStark;
