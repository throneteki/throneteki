import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class WeLightTheWay extends DrawCard {
    // We Light the Way (20040)
    // Action: Kneel a House Hightower or Oldtown card to place the top card of your deck in shadows
    // with a shadow token on it. While that card is in shadows, it gains shadow (X). X is its
    // printed cost.
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into shadows',
            condition: (context) => context.player.drawDeck.length > 0,
            cost: ability.costs.kneel(
                (card) => card.hasTrait('House Hightower') || card.hasTrait('Oldtown')
            ),
            message:
                '{player} plays {source} and kneels {costs.kneel} to put the top card of their deck into shadows',
            gameAction: GameActions.putIntoShadows((context) => ({
                card: context.player.drawDeck[0]
            })).then((context, event) => {
                const card = event.card;
                const shadowCost = card.translateXValue(card.getPrintedCost());
                return {
                    gameAction: GameActions.simultaneously([
                        GameActions.placeToken({ card, token: Tokens.shadow }),
                        GameActions.lastingEffect(() => ({
                            duration: 'custom',
                            until: {
                                onCardMoved: (event) =>
                                    event.card === card && event.originalLocation === 'shadows'
                            },
                            match: card,
                            targetLocation: 'shadows',
                            effect: ability.effects.addKeyword(`Shadow (${shadowCost})`)
                        }))
                    ])
                };
            })
        });
    }
}

WeLightTheWay.code = '20040';

export default WeLightTheWay;
