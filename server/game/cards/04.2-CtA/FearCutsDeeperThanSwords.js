const DrawCard = require('../../drawcard.js');

class FearCutsDeeperThanSwords extends DrawCard {
    setupCardAbilities() {
        //TODO: needs to be able to cancel stealth
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event => event.ability.targets.some(target => target.type === 'choose') &&
                                                 event.targets.length === 1 &&
                                                 event.targets.some(target => {
                                                     return target.getType() === 'character' && target.isFaction('stark');
                                                 })
            },
            handler: context => {
                let target = context.event.targets[0];
                context.event.cancel();

                if(target.kneeled) {
                    target.controller.standCard(target);
                }

                this.game.addMessage('{0} plays {1} to cancel {2} and stand {3}',
                    context.player, this, context.event.source, target);
            }
        });
    }
}

FearCutsDeeperThanSwords.code = '04022';

module.exports = FearCutsDeeperThanSwords;
