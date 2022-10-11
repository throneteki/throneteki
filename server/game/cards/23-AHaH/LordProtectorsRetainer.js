const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class LordProtectorsRetainer extends DrawCard {
    setupCardAbilities(ability) {
        //TODO: needs to be able to cancel stealth (along with FearCutsDeeperThanSwords)
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event => event.ability.targets.some(target => target.type === 'choose') &&
                                                 event.targets.hasSingleTarget() &&
                                                 event.targets.anySelection(selection => (
                                                    selection.choosingPlayer !== this.controller &&
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
