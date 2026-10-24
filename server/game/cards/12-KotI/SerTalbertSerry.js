import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class SerTalbertSerry extends DrawCard {
    // Ser Talbert Serry (12037)
    // No attachments except Weapon.
    // Reaction: After an opponent triggers a location ability, Ser Talbert Serry gets +2 STR until
    // the end of the phase. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.getType() === 'location' &&
                    event.source.controller !== context.source.controller &&
                    !event.ability.isForcedAbility()
            },
            limit: ability.limit.perPhase(3),
            message: '{player} uses {source} to give +2 STR to {source} until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

SerTalbertSerry.code = '12037';

export default SerTalbertSerry;
