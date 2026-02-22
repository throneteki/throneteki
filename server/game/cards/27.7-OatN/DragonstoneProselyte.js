import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class DragonstoneProselyte extends DrawCard {
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
            cost: ability.costs.movePowerFromFaction({
                amount: 1,
                condition: (card, context) => card === context.event.source
            }),
            message: {
                format: '{player} uses {source} and moves 1 power from their faction card to {character} to cancel {character}',
                args: { character: (context) => context.event.source }
            },
            limit: ability.limit.perRound(1),
            gameAction: GameActions.genericHandler((context) => {
                context.event.cancel();
            })
        });
    }
}

DragonstoneProselyte.code = '27505';
DragonstoneProselyte.version = '1.0.0';

export default DragonstoneProselyte;
