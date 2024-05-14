const DrawCard = require('../../drawcard.js');

class Harrenhal extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.controller !== this.controller
            },
            cost: [ability.costs.sacrificeSelf(), ability.costs.kneelFactionCard()],
            handler: (context) => {
                context.event.card.controller.killCharacter(context.event.card);
                this.game.addMessage(
                    '{0} sacrifices {1} and kneels their faction card to kill {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

Harrenhal.code = '04082';

module.exports = Harrenhal;
