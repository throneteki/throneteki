import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OnAMistyMorn extends DrawCard {
    // "On a Misty Morn" (11117)
    // Action: Choose up to 2 non-unique characters in your dead pile and return them to your hand.
    setupCardAbilities() {
        this.action({
            title: 'Return characters to hand',
            target: {
                mode: 'upTo',
                numCards: 2,
                cardCondition: (card, context) =>
                    card.controller === context.source.controller &&
                    card.location === 'dead pile' &&
                    card.getType() === 'character' &&
                    !card.isUnique()
            },
            message: '{player} plays {source} to return {target} to their hand',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

OnAMistyMorn.code = '11117';

export default OnAMistyMorn;
