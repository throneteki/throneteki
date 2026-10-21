import { Tokens } from '../../Constants/Tokens.js';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WidowsFord extends DrawCard {
    // "Widow's Ford" (26118)
    // Shadow (0).
    // Reaction: After an attachment or location enters your discard pile, place it in shadows with
    // a shadow token on it. While that card is in shadows, it gains shadow (X). X is its printed
    // cost.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.controller === this.controller &&
                    event.card.isMatch({
                        location: 'discard pile',
                        type: ['attachment', 'location']
                    })
            },
            message: {
                format: '{player} plays {source} to place {card} in shadows with a shadow token on it',
                args: { card: (context) => context.event.card }
            },
            gameAction: GameActions.simultaneously([
                GameActions.putIntoShadows((context) => ({ card: context.event.card })),
                GameActions.placeToken((context) => ({
                    card: context.event.card,
                    token: Tokens.shadow
                })),
                GameActions.genericHandler((context) => {
                    this.lastingEffect((ability) => ({
                        condition: () => context.event.card.location === 'shadows',
                        targetLocation: 'any',
                        match: context.event.card,
                        effect: ability.effects.addKeyword(
                            `Shadow (${context.event.card.translateXValue(context.event.card.getPrintedCost())})`
                        )
                    }));
                })
            ])
        });
    }
}

WidowsFord.code = '26118';

export default WidowsFord;
