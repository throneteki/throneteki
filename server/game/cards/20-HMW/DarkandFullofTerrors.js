import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class DarkandFullofTerrors extends DrawCard {
    // Dark and Full of Terrors (20003)
    // Play only if you control a R'hllor character.
    // Action: Choose a kneeling character with STR 3 or lower and place it in shadows with a shadow
    // token on it. While that card is in shadows, it gains shadow (X). X is its printed cost.
    setupCardAbilities(ability) {
        this.action({
            title: 'Place character in shadows',
            condition: (context) =>
                context.player.anyCardsInPlay(
                    (card) => card.hasTrait("R'hllor") && card.getType() === 'character'
                ),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3 &&
                    card.kneeled
            },
            message: '{player} plays {source} to put {target} into shadows',
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.target })).then(
                (context, event) => {
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
                }
            )
        });
    }
}

DarkandFullofTerrors.code = '20003';

export default DarkandFullofTerrors;
