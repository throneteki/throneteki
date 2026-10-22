import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Patience extends DrawCard {
    // Patience (10020)
    // Character you control only.
    // Challenges Action: Return attached character to its owner's hand.
    setupCardAbilities() {
        this.attachmentRestriction({ controller: 'current' });
        this.action({
            title: 'Return parent to hand',
            phase: 'challenge',
            message: {
                format: "{player} uses {source} to return {parent} to its owner's hand",
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.returnCardToHand((context) => ({
                card: context.source.parent
            }))
        });
    }
}

Patience.code = '10020';

export default Patience;
