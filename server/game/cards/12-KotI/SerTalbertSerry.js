import DrawCard from '../../drawcard.js';

class SerTalbertSerry extends DrawCard {
    // Ser Talbert Serry (12037)
    // No attachments except Weapon.
    // Reaction: After an opponent triggers a location ability, Ser Talbert Serry gets +2 STR until
    // the end of the phase. (Limit 3 times per phase.)
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

export default SerTalbertSerry;
