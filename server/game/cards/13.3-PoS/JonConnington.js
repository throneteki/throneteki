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
                this.game.resolveGameAction(
                    GameActions.revealCards(context => ({
                        player: context.player,
                        cards: [context.target]
                    })).then({
                        condition: context => context.event.cards[0].isMatch({
                            printedCostOrLower: 4,
                            not: { type: 'event' }
                        }) && context.event.revealed.length > 0,
                        message: '{player} {gameAction}',
                        gameAction: GameActions.putIntoPlay(context => ({
                            card: context.event.revealed[0]
                        }))
                    }),
                    context
                );
            }
        });
    }
}

JonConnington.code = '13053';

module.exports = JonConnington;
