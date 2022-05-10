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
            message: '{player} uses {source} to reveal {target}',
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.revealCard(context => ({ card: context.target })),
                    context
                ).thenExecute(event => {
                    if(event.card.getType() !== 'event' && event.card.getPrintedCost() <= 4 && context.player.canPutIntoPlay(event.card)) {
                        this.game.addMessage('Then {0} puts {1} into play for {2}', context.player, event.card, this);
                        context.player.putIntoPlay(event.card);
                    }
                });
            }
        });
    }
}

JonConnington.code = '13053';

module.exports = JonConnington;
