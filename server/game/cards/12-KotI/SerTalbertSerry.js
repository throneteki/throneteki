const DrawCard = require('../../drawcard');

class SerTalbertSerry extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.getType() === 'location' &&
                    event.source.controller !== this.controller &&
                    !event.ability.isForcedAbility()
            },
            limit: ability.limit.perPhase(3),
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to give +2 STR to {1} until the end of the phase',
                    context.player,
                    this
                );
                this.untilEndOfPhase((ability) => ({
                    match: this,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

SerTalbertSerry.code = '12037';

module.exports = SerTalbertSerry;
