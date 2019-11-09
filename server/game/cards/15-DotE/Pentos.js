const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Pentos extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDrawn: event =>
                    event.player === this.controller &&
                    event.card.getType() === 'attachment' &&
                    this.controller.canPutIntoPlay(event.card)
            },
            cost: ability.costs.kneelSelf(),
            message: {
                format: '{player} kneels {source} to reveal {drawnCard} and put it into play',
                args: { drawnCard: context => context.event.card }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.putIntoPlay(context => ({
                        card: context.event.card
                    })).then({
                        condition: thenContext => thenContext.player.canDraw(),
                        message: 'Then {player} draws 1 card',
                        handler: thenContext => {
                            this.game.resolveGameAction(
                                GameActions.drawCards(thenContext => ({
                                    player: thenContext.player,
                                    amount: 1
                                })),
                                thenContext
                            );
                        }
                    }),
                    context
                );
            }
        });
    }
}

Pentos.code = '15018';

module.exports = Pentos;
