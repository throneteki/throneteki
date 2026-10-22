import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LongMayHeReign extends DrawCard {
    // Long May He Reign (13108)
    // King character only.
    // Attached character cannot be killed.
    // Forced Reaction: After you lose a [power] challenge as the defending player, sacrifice Long
    // May He Reign.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'King' });
        this.whileAttached({
            effect: ability.effects.cannotBeKilled()
        });
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.challengeType === 'power' &&
                    event.challenge.defendingPlayer === context.source.controller
            },
            message: '{player} is forced by {source} to sacrifice {source}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });
    }
}

LongMayHeReign.code = '13108';

export default LongMayHeReign;
