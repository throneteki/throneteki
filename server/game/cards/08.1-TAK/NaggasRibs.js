const DrawCard = require('../../drawcard.js');

class NaggasRibs extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicDominanceStrength(
                () => 2 * this.controller.deadPile.length
            )
        });

        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.card.getType() === 'character' &&
                    event.card.location === 'discard pile' &&
                    event.card.owner === this.controller
            },
            handler: (context) => {
                let card = context.event.card;
                context.player.moveCard(card, 'dead pile');
                this.game.addMessage(
                    '{0} uses {1} to move {2} to their dead pile',
                    context.player,
                    this,
                    card
                );
            }
        });
    }
}

NaggasRibs.code = '08013';

module.exports = NaggasRibs;
