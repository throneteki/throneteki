const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Bribery extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payXGold(() => this.getMinXValue(), () => 99),
            target: {
                cardCondition: (card, context) => (
                    card.isMatch({ location: 'play area', type: 'character', kneeled: false }) &&
                    (!context.xValue || card.getPrintedCost() <= context.xValue) &&
                    card.allowGameAction('kneel')
                )
            },
            message: {
                format: '{player} plays {source} and pays {xValue} gold to kneel {target}',
                args: { xValue: context => context.xValue }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.kneelCard(context => ({ card: context.target }))
                        .then({
                            gameAction: GameActions.ifCondition({
                                condition: context => context.parentContext.target.match({ trait: ['Ally', 'Mercenary'], hasAttachments: false }),
                                thenAction: GameActions.may({
                                    title: context => `Take control of ${context.parentContext.target.name}?`,
                                    message: {
                                        format: 'Then, {player} takes control of {target}',
                                        args: { target: context => context.parentContext.target }
                                    },
                                    gameAaction: GameActions.takeControl(context => ({ player: context.player, card: context.parentContext.target }))
                                })
                            })
                        }),
                    context
                );
            }
        });
    }

    getMinXValue() {
        const characters = this.game.filterCardsInPlay(card => card.isMatch({ type: 'character', kneeled: false }));
        const costs = characters.map(card => card.getPrintedCost());
        return Math.min(...costs);
    }
}

Bribery.code = '17146';

module.exports = Bribery;
