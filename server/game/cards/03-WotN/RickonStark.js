const DrawCard = require('../../drawcard.js');

class RickonStark extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event => event.source.hasText('search')
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.event.cancel();

                this.game.addMessage('{0} sacrifices {1} to cancel {2}', context.player, this, context.event.source);
            }
        });
    }
}

RickonStark.code = '03016';

module.exports = RickonStark;
