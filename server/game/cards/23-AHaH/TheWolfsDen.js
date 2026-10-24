import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class TheWolfsDen extends DrawCard {
    // The Wolf's Den (23012)
    // Reaction: After a character you control is sacrificed or killed, kneel The Wolf's Den to
    // place the bottom card of your deck in shadows with a shadow token on it. While that card is
    // in shadows, it gains shadow (X). X is its printed cost.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event, context) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === context.source.controller,
                onCharacterKilled: (event, context) =>
                    event.card.controller === context.source.controller
            },
            cost: ability.costs.kneelSelf(),
            message: '{player} kneels {source} to put the bottom card of their deck into shadows',
            gameAction: GameActions.placeCard((context) => ({
                card: context.player.drawDeck.slice(-1)[0],
                location: 'shadows'
            })).then({
                gameAction: GameActions.simultaneously([
                    GameActions.placeToken((context) => ({
                        card: context.event.card,
                        token: Tokens.shadow
                    })),
                    GameActions.lastingEffect((context) => ({
                        duration: 'custom',
                        condition: () => context.event.card.location === 'shadows',
                        targetLocation: 'any',
                        match: context.event.card,
                        effect: ability.effects.addKeyword(
                            `Shadow (${context.event.card.translateXValue(context.event.card.getPrintedCost())})`
                        )
                    }))
                ])
            })
        });
    }
}

TheWolfsDen.code = '23012';

export default TheWolfsDen;
