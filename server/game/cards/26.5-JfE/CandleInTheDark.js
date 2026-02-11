import DrawCard from '../../drawcard.js';

class CandleInTheDark extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cannotBeBypassedByStealth()
        });
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    event.source.isShadow &&
                    event.source.isShadow()
            },
            cost: ability.costs.kneelParent(),
            message: {
                format: '{player} uses {source} and kneels {parent} to cancel {card}',
                args: { parent: () => this.parent, card: (context) => context.event.source }
            },
            handler: (context) => {
                context.event.cancel();
            }
        });
    }
}

CandleInTheDark.code = '26098';

export default CandleInTheDark;
