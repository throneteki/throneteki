import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class TyrionLannister extends DrawCard {
    // Tyrion Lannister (13089)
    // Shadow (5). Insight.
    // Reaction: After a non-event card you control comes out of shadows, place another card you
    // control in shadows with a shadow token on it. While that card is in shadows, it gains shadow
    // (X). X is its printed cost. (Limit once per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card.controller === context.player && event.card.getType() !== 'event'
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.player &&
                    card !== context.event.card
            },
            message: '{player} uses {source} to put {target} into shadows',
            gameAction: GameActions.putIntoShadows((context) => ({ card: context.target })).then({
                gameAction: GameActions.simultaneously([
                    GameActions.placeToken((context) => ({
                        card: context.parentContext.target,
                        token: Tokens.shadow
                    })),
                    GameActions.lastingEffect((context) => {
                        const card = context.parentContext.target;
                        return {
                            duration: 'custom',
                            condition: () => card.location === 'shadows',
                            targetLocation: 'any',
                            match: card,
                            effect: ability.effects.addKeyword(
                                `Shadow (${card.translateXValue(card.getPrintedCost())})`
                            )
                        };
                    })
                ])
            })
        });
    }
}

TyrionLannister.code = '13089';

export default TyrionLannister;
