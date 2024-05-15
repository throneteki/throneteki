import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class FearCutsDeeperThanSwords extends DrawCard {
    setupCardAbilities() {
        //TODO: needs to be able to cancel stealth
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.targets.some((target) => target.type === 'choose') &&
                    event.targets.length === 1 &&
                    event.targets[0].controller === this.controller &&
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
