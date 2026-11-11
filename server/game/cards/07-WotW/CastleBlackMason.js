import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CastleBlackMason extends DrawCard {
    // Castle Black Mason (07009)
    // No attachments except Weapon.
    // Action: Kneel 2 Builder characters to search the top 10 cards of your deck for a location or
    // attachment, reveal it, and add it to your hand. Shuffle your deck. (Limit twice per round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 10 cards for location or attachment',
            cost: ability.costs.kneelMultiple(
                2,
                (card) => card.getType() === 'character' && card.hasTrait('Builder')
            ),
            limit: ability.limit.perRound(2),
            message:
                '{player} uses {source} and kneels {costs.kneel} to search the top 10 cards of their deck for a location or attachment',
            gameAction: GameActions.search({
                title: 'Select a card',
                topCards: 10,
                match: { type: ['attachment', 'location'] },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

CastleBlackMason.code = '07009';

export default CastleBlackMason;
