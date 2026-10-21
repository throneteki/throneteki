import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class Harrenhal extends DrawCard {
    // Harrenhal (16021)
    // Prized 2.
    // If Harrenhal has 3 or more ghost tokens on it, sacrifice it.
    // Interrupt: When the effects of a non-plot, non-agenda triggered ability would initiate, kill
    // a character you own and control to cancel those effects. Place a ghost token on Harrenhal.
    // (Limit once per phase.)
    setupCardAbilities(ability) {
        this.stateCheck({
            condition: (context) => context.source.tokens[Tokens.ghost] >= 3,
            message: '{player} sacrifices {source} as it has 3 or more ghost tokens',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.isTriggeredAbility() &&
                    !['agenda', 'plot'].includes(event.source.getType()) &&
                    (event.ability.isForcedAbility() || event.source.controller !== context.player)
            },
            cost: ability.costs.kill(
                (card, context) =>
                    card.getType() === 'character' &&
                    card.controller === context.player &&
                    card.owner === context.player
            ),
            message: {
                format: '{player} uses {source} and kills {killedCharacter} to cancel {event} and place a ghost token on {source}',
                args: {
                    killedCharacter: (context) => context.costs.kill,
                    event: (context) => context.event.source
                }
            },
            gameAction: GameActions.simultaneously((context) => [
                GameActions.cancelEffects({ event: context.event }),
                GameActions.placeToken({
                    amount: 1,
                    card: context.source,
                    token: Tokens.ghost
                })
            ])
        });
    }
}

Harrenhal.code = '16021';

export default Harrenhal;
