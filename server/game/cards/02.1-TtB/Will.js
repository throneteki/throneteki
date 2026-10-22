import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Will extends DrawCard {
    // Will (02001)
    // Stealth. Insight.
    // Forced Reaction: After you lose an unopposed challenge, sacrifice a Ranger character you
    // control.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.controller === event.challenge.loser &&
                    event.challenge.isUnopposed()
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Ranger') &&
                    card.controller === context.source.controller
            },
            message: '{player} is forced to use {source} to sacrifice {target}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
        });
    }
}

Will.code = '02001';

export default Will;
