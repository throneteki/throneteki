import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordProtectorsRetainer extends DrawCard {
    // Lord Protector's Retainer (23022)
    // Interrupt: When the effects of an ability that chooses a Lord or Lady character you control
    // as its only target would initiate, return Lord Protector's Retainer to your hand to cancel
    // those effects. (Max once per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.targets.some((target) => target.type === 'choose') &&
                    event.targets.length === 1 &&
                    event.targets[0].controller === context.player &&
                    event.targets[0].isMatch({ trait: ['Lord', 'Lady'], type: 'character' })
            },
            message: {
                format: '{player} returns {source} to their hand to cancel {event}',
                args: { event: (context) => context.event.source }
            },
            cost: ability.costs.returnSelfToHand(),
            max: ability.limit.perPhase(1),
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
    }
}

LordProtectorsRetainer.code = '23022';

export default LordProtectorsRetainer;
