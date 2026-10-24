import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FieryFollowers extends DrawCard {
    // Fiery Followers (01054)
    // Reaction: After the dominance phase begins, stand Fiery Followers.
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'dominance' && context.source.kneeled
            },
            message: '{player} uses {source} to stand {source}',
            gameAction: GameActions.standCard((context) => ({ card: context.source }))
        });
    }
}

FieryFollowers.code = '01054';

export default FieryFollowers;
