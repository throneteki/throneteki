const DrawCard = require('../../drawcard.js');

class Pentos extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardsDrawn: event =>
                    event.source.controller === this.controller &&
                    event.cards[0].getType() === 'attachment' &&
                    this.controller.canPutIntoPlay(event.cards[0])
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.controller.putIntoPlay(context.event.cards[0]);
                this.game.addMessage('{0} reveals {1} and kneels {2} to put it into play', context.player, context.event.cards[0], this);
                if(this.controller.canDraw()) {
                    this.controller.drawCardsToHand(1);
                    this.game.addMessage('{0} then draws 1 card', context.player, context.event.cards[0], this);
                }
            }
        });
    }
}

Pentos.code = '15018';

module.exports = Pentos;
