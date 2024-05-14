import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { Tokens } from '../../Constants/index.js';

class Harrenhal extends DrawCard {
    setupCardAbilities(ability) {
        // TODO: Technically this should not be reaction
        this.forcedReaction({
            cannotBeCanceled: true,
            when: {
                onTokenPlaced: (event) => event.card === this && this.tokens[Tokens.ghost] >= 3
            },
            message: '{player} is forced to sacrifice {source}',
            gameAction: GameActions.sacrificeCard({
                card: this
            })
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: (event) =>
                    event.ability.isTriggeredAbility() &&
                    !['agenda', 'plot'].includes(event.source.getType()) &&
                    (event.ability.isForcedAbility() || event.source.controller !== this.controller)
            },
            cost: ability.costs.kill(
                (card) =>
                    card.getType() === 'character' &&
                    card.controller === this.controller &&
                    card.owner === this.controller
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
                    card: this,
                    token: Tokens.ghost
                })
            ])
        });
    }
}

Harrenhal.code = '16021';

export default Harrenhal;
