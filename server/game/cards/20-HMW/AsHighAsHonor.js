import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AsHighAsHonor extends DrawCard {
    // As High as Honor (20049)
    // Marshaling Action: Kneel a neutral location with printed cost 1 or higher to put a neutral
    // card into play from your hand knelt. Then, if that card has the House Arryn trait, stand it.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into play',
            phase: 'marshal',
            cost: ability.costs.kneel(
                (card) =>
                    card.getType() === 'location' &&
                    card.isFaction('neutral') &&
                    card.getPrintedCost() >= 1
            ),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.player &&
                    card.isFaction('neutral') &&
                    context.player.canPutIntoPlay(card)
            },
            message: '{player} plays {source} to put {target} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target,
                kneeled: true
            })).then({
                condition: (context) => context.parentContext.target.hasTrait('House Arryn'),
                message: {
                    format: 'Then {player} stands {originalTarget}',
                    args: { originalTarget: (context) => context.parentContext.target }
                },
                gameAction: GameActions.standCard((context) => ({
                    card: context.parentContext.target
                }))
            })
        });
    }
}

AsHighAsHonor.code = '20049';

export default AsHighAsHonor;
