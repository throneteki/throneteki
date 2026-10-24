import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FearCutsDeeperThanSwords extends DrawCard {
    // Fear Cuts Deeper Than Swords (04022)
    // Interrupt: When the effects of an ability that chooses a [stark] character you control as its
    // only target would initiate, cancel those effects and stand that character.
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.targets.some((target) => target.type === 'choose') &&
                    event.targets.length === 1 &&
                    event.targets[0].controller === context.player &&
                    event.targets[0].isMatch({ type: 'character', faction: 'stark' })
            },
            message: {
                format: '{player} plays {source} to cancel {event} and stand {character}',
                args: {
                    event: (context) => context.event.source,
                    character: (context) => context.event.targets[0]
                }
            },
            gameAction: GameActions.simultaneously([
                GameActions.cancelEffects((context) => ({ event: context.event })),
                GameActions.standCard((context) => ({ card: context.event.targets[0] }))
            ])
        });
    }
}

FearCutsDeeperThanSwords.code = '04022';

export default FearCutsDeeperThanSwords;
