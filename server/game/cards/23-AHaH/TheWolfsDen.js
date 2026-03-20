import DrawCard from '../../drawcard.js';
import { Tokens } from '../../Constants/index.js';
import GameActions from '../../GameActions/index.js';

class TheWolfsDen extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.controller === this.controller,
                onCharacterKilled: (event) => event.card.controller === this.controller
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
                        tokens: Tokens.shadow
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
            })
        });
    }
}

TheWolfsDen.code = '23012';

export default TheWolfsDen;
