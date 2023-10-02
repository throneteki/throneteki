const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class PrincesLoyalist extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own triggered abilities to forced triggered abilities
                onCardAbilityInitiated: event => event.ability.isTriggeredAbility() &&
                                                 event.source.getType() === 'character' &&
                                                 (event.ability.isForcedAbility() || event.source.controller !== this.controller)
            },
            cost: ability.costs.payGold(2),
            message: {
                format: '{player} uses {source} and pays 2 gold to cancel {abilitySource}',
                args: { abilitySource: context => context.event.source }
            },
            gameAction: GameActions.cancelEffects(context => ({
                event: context.event
            }))
        });
    }
}

PrincesLoyalist.code = '16007';

module.exports = PrincesLoyalist;
