const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class LordProtectorsRetainer extends DrawCard {
    setupCardAbilities(ability) {
        //TODO: needs to be able to cancel stealth (along with FearCutsDeeperThanSwords)
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event =>    event.targets.hasSingleTarget() &&
                                                    event.targets.anySelection(selection => (
                                                        selection.value.controller === this.controller &&
                                                        selection.value.isMatch({ trait: ['Lord', 'Lady'], type: 'character' })
                                                    ))
            },
            max: ability.limit.perPhase(1),
            gameAction: GameActions.cancelEffects(context => ({ event: context.event }))
        });
    }
}

LordProtectorsRetainer.code = '23028';

module.exports = LordProtectorsRetainer;
