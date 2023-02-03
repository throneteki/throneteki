const DrawCard = require('../../drawcard.js');

class SerGilbertFarring extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event => event.source.hasTrait('Siege')
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                context.event.cancel();
                this.game.addMessage('{0} kneels {1} to cancel {2}', context.player, this, context.event.source);
            }
        });
    }
}

SerGilbertFarring.code = '24002';

module.exports = SerGilbertFarring;
