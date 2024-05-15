import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackMarketMerchant extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
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
