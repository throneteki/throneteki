import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PrincesLoyalist extends DrawCard {
    // Prince's Loyalist (16007)
    // Prized 1. Stealth. Immune to events.
    // Interrupt: When the effects of a triggered character ability would initiate, pay 2 gold to
    // cancel those effects.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own triggered abilities to forced triggered abilities
                onCardAbilityInitiated: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.getType() === 'character' &&
                    (event.ability.isForcedAbility() || event.player !== context.source.controller)
            },
            cost: ability.costs.payGold(2),
            message: {
                format: '{player} uses {source} and pays 2 gold to cancel {abilitySource}',
                args: { abilitySource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({
                event: context.event
            }))
        });
    }
}

PrincesLoyalist.code = '16007';

export default PrincesLoyalist;
