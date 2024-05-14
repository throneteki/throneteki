const DrawCard = require('../../drawcard.js');

class RimeGate extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardDiscarded: (event) =>
                    event.card !== this &&
                    event.card.controller === this.controller &&
                    event.card.getType() === 'location' &&
                    event.card.canBeSaved() &&
                    event.allowSave &&
                    event.card.location === 'play area'
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                context.event.saveCard();
                this.game.addMessage(
                    '{0} kneels {1} to save {2}',
                    context.player,
                    this,
                    context.event.card
                );
            }
        });
    }
}

RimeGate.code = '13106';

module.exports = RimeGate;
