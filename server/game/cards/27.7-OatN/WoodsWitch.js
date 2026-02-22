import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WoodsWitch extends DrawCard {
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
            cost: ability.costs.sacrifice({ type: 'character', trait: 'Old Gods' }),
            message: {
                format: '{player} uses {source} and sacrifices {costs.sacrifice} to cancel {character}',
                args: { character: (context) => context.event.source }
            },
            limit: ability.limit.perRound(1),
            gameAction: GameActions.genericHandler((context) => {
                context.event.cancel();
            })
        });
    }
}

WoodsWitch.code = '27566';
WoodsWitch.version = '1.0.0';

export default WoodsWitch;
