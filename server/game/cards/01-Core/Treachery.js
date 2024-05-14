const DrawCard = require('../../drawcard.js');

class Treachery extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own triggered abilities to forced triggered abilities
                onCardAbilityInitiated: (event) =>
                    this.controller.anyCardsInPlay(
                        (card) =>
                            card.isUnique() &&
                            card.isFaction('lannister') &&
                            card.getType() === 'character'
                    ) &&
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType()) &&
                    (event.ability.isForcedAbility() || event.source.controller !== this.controller)
            },
            handler: (context) => {
                context.event.cancel();
                this.game.addMessage(
                    '{0} plays {1} to cancel {2}',
                    this.controller,
                    this,
                    context.event.source
                );
            }
        });
    }
}

Treachery.code = '01102';

module.exports = Treachery;
