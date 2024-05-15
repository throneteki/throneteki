import DrawCard from '../../drawcard.js';

class TheRedKeep extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            cost: ability.costs.kneelSelf(),
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType()) &&
                    event.source.controller !== this.controller
            },
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} kneels {1} to cancel {2}',
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

TheRedKeep.code = '15030';

export default TheRedKeep;
