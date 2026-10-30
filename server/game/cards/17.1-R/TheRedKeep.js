import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheRedKeep extends DrawCard {
    // The Red Keep (17111)
    // Interrupt: When the effects of an opponent's triggered character, location, or attachment
    // ability would initiate, kneel The Red Keep and pay 1 gold to cancel those effects.
    // +1 Income.
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    ['character', 'location', 'attachment'].includes(event.source.getType()) &&
                    event.player !== context.source.controller
            },
            cost: [ability.costs.kneelSelf(), ability.costs.payGold(1)],
            message: {
                format: '{player} kneels {source} and pays 1 gold to cancel {eventSource}',
                args: { eventSource: (context) => context.event.source }
            },
            gameAction: GameActions.cancelEffects((context) => ({ event: context.event }))
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

TheRedKeep.code = '17111';

export default TheRedKeep;
