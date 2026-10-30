import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class UnexpectedReturn extends DrawCard {
    // Unexpected Return (11015)
    // Challenges Action: Choose a character in your discard pile and put it into play.
    setupCardAbilities() {
        this.action({
            phase: 'challenge',
            title: 'Put character into play',
            target: {
                cardCondition: (card, context) =>
                    card.getType() === 'character' &&
                    card.location === 'discard pile' &&
                    card.controller === context.source.controller
            },
            message: '{player} uses {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

UnexpectedReturn.code = '11015';

export default UnexpectedReturn;
