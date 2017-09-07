const DrawCard = require('../../drawcard.js');

class CaptainsDaughter extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => !event.card.isLoyal() && event.card.getType() === 'character' &&
                                           event.card.controller !== this.controller
            },
            cost: [
                ability.costs.sacrificeSelf(),
                ability.costs.kneelFactionCard()
            ],
            handler: context => {
                context.event.card.owner.moveCard(context.event.card, 'draw deck');
                this.game.addMessage('{0} sacrifices {1} and kneels their faction card to move {2} to the top of {3}\'s deck',
                    this.controller, this, context.event.card, context.event.card.owner);
            }
        });
    }
}

CaptainsDaughter.code = '04012';

module.exports = CaptainsDaughter;
