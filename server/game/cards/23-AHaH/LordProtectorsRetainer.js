import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LordProtectorsRetainer extends DrawCard {
    setupCardAbilities(ability) {
        //TODO: needs to be able to cancel stealth (along with FearCutsDeeperThanSwords)
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.targets.some((target) => target.type === 'choose') &&
                    event.targets.length === 1 &&
                    event.targets[0].controller === this.controller &&
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
