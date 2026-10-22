import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class JanosSlynt extends DrawCard {
    // Janos Slynt (11006)
    // Shadow (0).
    // Forced Reaction: After Janos Slynt comes out of shadows, sacrifice a [thenightswatch]
    // character.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card, context) =>
                    card.controller === context.source.controller &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.isFaction('thenightswatch'),
                gameAction: 'sacrifice'
            },
            message: '{player} is forced by {source} to sacrifice {target}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.target }))
        });
    }
}

JanosSlynt.code = '11006';

export default JanosSlynt;
