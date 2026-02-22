import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class PurpleGraces extends DrawCard {
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
            cost: ability.costs.kneel({ trait: 'Grace', condition: (card) => card !== this }),
            message: {
                format: '{player} uses {source} and kneels {costs.kneel} to cancel {character}',
                args: { character: (context) => context.event.source }
            },
            limit: ability.limit.perRound(1),
            gameAction: GameActions.genericHandler((context) => {
                context.event.cancel();
            })
        });
    }
}

PurpleGraces.code = '27577';
PurpleGraces.version = '1.0.0';

export default PurpleGraces;
