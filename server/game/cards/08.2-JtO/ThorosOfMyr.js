const DrawCard = require('../../drawcard.js');

class ThorosOfMyr extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.discardPowerFromSelf(1)
            ],
            target: {
                cardCondition: (card, context) => context.event.cards.includes(card) && card !== this && !card.isLoyal() &&
                                                  card.controller === this.controller && card.canBeSaved()
            },
            handler: context => {
                context.event.saveCard(context.target);
                this.game.addMessage('{0} kneels and discards 1 power from {1} to save {2}',
                    context.player, this, context.target);
            }
        });
    }
}

ThorosOfMyr.code = '08037';

module.exports = ThorosOfMyr;
