const DrawCard = require('../../drawcard.js');

class BeggingBrother extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                //Nested cancels can get quite disorienting as this can cancel itself too, so limiting it to opponent's Begging Brother only
                onCardAbilityInitiated: event => event.source.getType() === 'character' && (event.source.name !== this.name || event.source.controller !== this.controller)
            },
            cost: ability.costs.discardGold(),
            handler: context => {
                context.event.cancel();
                this.game.addMessage('{0} discards 1 gold from {1} to cancel {2}', this.controller, this, context.event.source);
            }
        });
    }
}

BeggingBrother.code = '06097';

module.exports = BeggingBrother;
