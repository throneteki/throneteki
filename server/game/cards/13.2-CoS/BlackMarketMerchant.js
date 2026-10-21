import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackMarketMerchant extends DrawCard {
    // Black Market Merchant (13033)
    // Shadow (2).
    // Reaction: After Black Market Merchant comes out of shadows, search the top 10 cards of your
    // deck for an attachment with printed cost 3 or lower and attach it to an eligible character
    // you control. Shuffle your deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            message:
                '{player} uses {source} to search the top 10 cards of their deck for an attachment',
            gameAction: GameActions.search({
                title: 'Select an attachment',
                topCards: 10,
                match: { type: 'attachment', printedCostOrLower: 3, controller: 'current' },
                reveal: false,
                message: '{player} {gameAction}',
                gameAction: GameActions.putIntoPlay((context) => ({
                    card: context.searchTarget,
                    attachmentTargets: (card) => card.controller === context.player
                }))
            })
        });
    }
}

BlackMarketMerchant.code = '13033';

export default BlackMarketMerchant;
