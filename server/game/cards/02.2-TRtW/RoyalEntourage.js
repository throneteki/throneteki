import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RoyalEntourage extends DrawCard {
    // Royal Entourage (02027)
    // Forced Reaction: After you lose an [intrigue] challenge, kneel Royal Entourage.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            message: '{player} is forced to kneel {source}',
            gameAction: GameActions.kneelCard((context) => ({ card: context.source }))
        });
    }
}

RoyalEntourage.code = '02027';

export default RoyalEntourage;
