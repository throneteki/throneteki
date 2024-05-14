const DrawCard = require('../../drawcard');

class EdricDayne extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.owner === this.controller &&
                    !event.card.isLoyal() &&
                    event.card.location === 'discard pile'
            },
            limit: ability.limit.perRound(1),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to place {2} in shadows from their discard pile',
                    context.player,
                    this,
                    context.event.card
                );
                context.player.putIntoShadows(context.event.card, false);
            }
        });
    }
}

EdricDayne.code = '20017';

module.exports = EdricDayne;
