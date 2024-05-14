const DrawCard = require('../../drawcard.js');

class TheRedKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType()) &&
                    event.source.controller !== this.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} kneels {1} and pays 1 gold to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
            }
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

TheRedKeep.code = '17111';

module.exports = TheRedKeep;
