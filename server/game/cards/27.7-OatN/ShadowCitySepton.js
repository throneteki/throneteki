import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowCitySepton extends DrawCard {
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
            cost: ability.costs.discardFromShadows(),
            message: {
                format: '{player} uses {source} and discards {costs.discard} from shadows to cancel {character}',
                args: { character: (context) => context.event.source }
            },
            limit: ability.limit.perRound(1),
            gameAction: GameActions.genericHandler((context) => {
                context.event.cancel();
            })
        });
    }
}

ShadowCitySepton.code = '27542';
ShadowCitySepton.version = '1.0.0';

export default ShadowCitySepton;
