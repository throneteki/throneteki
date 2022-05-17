const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class JonConnington extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            target: {
                cardCondition: (card, context) => card.controller === context.player && card.location === 'shadows'
            },
            message: '{player} uses {source} to reveal a card from shadows',
            handler: context => {
                const gameAction = GameActions.revealCards(context => ({
                    player: context.player,
                    cards: [context.target]
                })).then({
                    message: '{player} {gameAction}',
                    gameAction: GameActions.ifCondition({
                        condition: context => context.event.cards[0].isMatch({
                            printedCostOrLower: 4,
                            not: { type: 'event' }
                        }),
                        thenAction: GameActions.putIntoPlay(context => ({
                            card: context.event.cards[0]
                        }))
                    })
                });

                this.game.resolveGameAction(gameAction, context);
            }
        });
    }
}

JonConnington.code = '13053';

module.exports = JonConnington;
