import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PriestOnTheDocks extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                //Restrict triggering on own character abilities to forced triggered abilities
                onCardAbilityInitiated: (event) =>
                    event.source.getType() === 'character' &&
                    event.ability.isTriggeredAbility() &&
                    (event.ability.isForcedAbility() || event.source.controller !== this.controller)
            },
            cost: ability.costs.killSelf(),
            message: {
                format: '{player} kills {cost.kill} to cancel {character}',
                args: { character: (context) => context.event.source }
            },
            max: ability.limit.perRound(1),
            gameAction: GameActions.genericHandler((context) => {
                context.event.cancel();
            })
        });
    }
}

PriestOnTheDocks.code = '27518';
PriestOnTheDocks.version = '1.0.0';

export default PriestOnTheDocks;
