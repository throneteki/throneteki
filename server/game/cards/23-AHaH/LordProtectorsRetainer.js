const DrawCard = require('../../drawcard');

class LordProtectorsRetainer extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            max: ability.limit.perPhase(1),
            when: {
                onTargetsChosen: event => (
                    event.ability.isTriggeredAbility() &&
                    event.targets.hasSingleTarget() &&
                    event.targets.anySelection(selection => (
                        selection.choosingPlayer !== this.controller &&
                        selection.value.controller === this.controller &&
                        selection.value.isMatch({ trait: ['Lord', 'Lady'], type: 'character' })
                    ))
                )
            },
            message: {
                format: '{player} uses {source} to choose itself as the target for {originalTarget} instead',
                args: { originalTarget: context => context.event.ability.card }
            },
            handler: context => {
                context.event.targets.selections[0].resolve(this);
            }
        });
    }
}

LordProtectorsRetainer.code = '23028';

module.exports = LordProtectorsRetainer;
