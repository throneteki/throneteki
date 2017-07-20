const DrawCard = require('../../../drawcard.js');

class MaesterAtTheRock extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: event => event.card.isFaction('lannister') && event.card.controller === this.controller &&
                                       event.card.location === 'discard pile'
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.controller.moveCard(context.event.card, 'draw deck');
                this.game.addMessage('{0} kneels {1} to move {2} to the top of their deck', this.controller, this, context.event.card);
            }
        });
    }
}

MaesterAtTheRock.code = '08010';

module.exports = MaesterAtTheRock;
