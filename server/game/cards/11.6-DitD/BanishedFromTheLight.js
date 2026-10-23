import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class BanishedFromTheLight extends DrawCard {
    // Banished from the Light (11108)
    // Shadow (2).
    // Reaction: After you win a [power] challenge, choose a character. Place it in shadows with a
    // shadow token on it. While that card is in shadows, it gains shadow (X). X is its printed
    // cost.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.isMatch({ challengeType: 'power', winner: context.player })
            },
            target: { cardCondition: { location: 'play area', type: 'character' } },
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

BanishedFromTheLight.code = '11108';

export default BanishedFromTheLight;
