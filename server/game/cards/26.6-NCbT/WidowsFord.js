import { Tokens } from '../../Constants/Tokens.js';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WidowsFord extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.isMatch({
                        location: 'discard pile',
                        controller: 'current',
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
